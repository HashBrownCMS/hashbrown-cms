'use strict';

/**
 * The base view for client side elements
 */
class ViewBase extends require('Common/Entity/View/ViewBase') {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.init();
    }

    /**
     * Initialise
     */
    async init() {
        this.element = this.getPlaceholder(this.scope(), this.model || {}, this.state || {});

        await this.update();

        this.trigger('ready');
    }

    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(HTMLElement, 'element', null);
        this.def(Object, 'events', {});
        this.def(Object, 'partials', {});
        this.def(Object, 'namedElements', {});
        this.def(Boolean, 'isUpdating', false);
    }
    
    /**
     * Gets the context
     *
     * @return {HashBrown.Entity.Context} Context
     */
    get context() {
        return HashBrown.Client.context;
    }

    /**
     * Gets the placeholder element
     *
     * @return {HTMLElement} Placeholder
     */
    getPlaceholder() {
        let element = document.createElement('div');
        element.className = 'placeholder';

        return element;
    }

    /**
     * Checks if this view is visible in the DOM
     *
     * @return {Boolean} Is valid
     */
    isValid() {
        return !!this.element && !!this.element.parentElement;
    }

    /**
     * Adds an event handler to this view
     *
     * @param {String} type
     * @param {Function} handler
     */
    on(type, handler) {
        checkParam(type, 'type', String, true);
        checkParam(handler, 'handler', Function, true);
   
        if(!this.events) { this.events = {} }
        if(!this.events[type]) { this.events[type] = []; }

        this.events[type].push(handler);

        return this;
    }

    /**
     * Triggers an event
     *
     * @param {String} type
     * @param {Array} params
     */
    async trigger(type, ...params) {
        checkParam(type, 'type', String, true);

        if(!this.events || !this.events[type]) { return; }

        try {
            for(let handler of this.events[type]) {
                await handler.call(this, ...params);
            }

        } catch(e) {
            this.setErrorState(e);

        }
    }

    /**
     * Sets the view state
     *
     * @param {String} name
     * @param {Object} properties
     */
    setState(name, properties = null) {
        if(properties) {
            this.state = properties;
        }

        this.state.name = name;

        this.render();
    }

    /**
     * Sets the view state as an error
     *
     * @param {Error} error
     */
    setErrorState(error) {
        checkParam(error, 'error', Error, true);
        
        this.state.name = 'error';
        this.state.message = error.message;

        // NOTE: This is useful, but obstructive in some cases
        debug.error(error, this);

        this.render();
    }

    /**
     * Gets a widget constructor by an alias
     *
     * @param {String} alias
     *
     * @return {HashBrown.Entity.View.Widget.WidgetBase} Widget
     */
    getWidget(alias) {
        for(let name in HashBrown.Entity.View.Widget) {
            if(name.toLowerCase() === alias) { return HashBrown.Entity.View.Widget[name]; }
        }

        return null;
    }

    /**
     * Renders a partial
     *
     * @param {String} name
     *
     * @return {HTMLElement} Render result
     */
    renderPartial(name) {
        checkParam(name, 'name', String);

        if(!this.partials[name]) { return null; }

        let element = this.partials[name].render(this.scope(), this.model, this.state);

        this.partials[name].element.parentElement.replaceChild(element, this.partials[name].element);

        this.partials[name].element = element; 

        return element;
    }

    /**
     * Scope
     *
     * @return {Object} Scope
     */
    scope() {
        return new Proxy({}, {
            get: (target, name, receiver) => {
                // Return any valid function starting with "on", like "onClick", "onChange", etc.
                // We are only including event handlers in the scope, because we want to minimise the use of logic in templates
                if(name.substring(0, 2) === 'on' && typeof this[name] === 'function') {
                    return (...args) => {
                        try {
                            this[name].call(this, ...args);

                        } catch(e) {
                            this.setErrorState(e);

                        }
                    };
                }

                // Look up recognised names                
                switch(name) {
                    // A simple conditional
                    case 'if':
                        return(statement, ...content) => {
                            if(!statement) { return null; }

                            return content;
                        };

                    // Loop an array or object
                    case 'each':
                        return (items, callback) => {
                            let content = [];

                            for(let key in items) {
                                let value = items[key];

                                if(!isNaN(key)) {
                                    key = parseFloat(key);
                                }

                                content.push(callback(key, value));
                            }

                            return content;
                        };

                    // Recurse through an array
                    case 'recurse':
                        return (items, key, callback) => {
                            if(!items || !Array.isArray(items)) { return []; }

                            let content = [];

                            for(let i in items) {
                                let item = items[i];

                                if(!item) { continue; }

                                let children = this.scope().recurse(item[key], key, callback);
                                let element = callback(i, item, children);

                                content.push(element);
                            }

                            return content;
                        };

                    // Render HTML
                    case 'html':
                        return (html) => {
                            let wrapper = document.createElement('div');

                            wrapper.innerHTML = html;

                            return Array.from(wrapper.childNodes);
                        };

                    // Render an included template
                    case 'include':
                        return (template, model) => {
                            if(typeof template !== 'function') { return ''; }
                            
                            return template(this.scope(), model || this.model, this.state);
                        };

                    // Register a partial
                    case 'partial':
                        return (partialName, renderFunction) => {
                            if(typeof renderFunction !== 'function') { return null; }

                            let content = renderFunction(this.scope(), this.model, this.state);
                                
                            this.partials[partialName] = {
                                render: renderFunction,
                                element: content
                            }

                            return content;
                        };
                   
                    // Render a field
                    case 'field':
                        return (model, ...content) => {
                            return require('template/field/fieldBase')(
                                this.scope(),
                                model,
                                {
                                    editorTemplate: (_, model, state) => { return content; },
                                }
                            );
                        };

                    // Any unrecognised key will be interpreted as an element constructor
                    // This means that, for instance, calling "_.div" will return a <div> HTMLElement 
                    default:
                        // First check if we have a custom widget matching the key
                        let widget = this.getWidget(name);

                        if(widget) {
                            return (attributes = {}) => {
                                let child = new widget({model: attributes});

                                if(attributes && attributes.name) {
                                    this.namedElements[attributes.name] = child;
                                }

                                return child.element;
                            };
                        }

                        // If not, render a native element
                        return (attributes = {}, ...content) => {
                            let element = this.createElement(name, attributes, content);

                            if(attributes && attributes.name) {
                                this.namedElements[attributes.name] = element;
                            }
                            
                            return element;
                        }
                }
            }
        });
    }
 
    /**
     * Appends content to an element
     * 
     * @param {HTMLElement} element
     * @param {Array} content
     */
    appendToElement(element, content) {
        if(!content) { return; }

        if(content.constructor === Array) {
            for(let item of content) {
                this.appendToElement(element, item);
            }

        } else {
            if(content && content.element instanceof Node) {
                content = content.element;
            
            } else if(content && content[0] && content[0] instanceof Node) {
                content = content[0];
            
            } else if(typeof content === 'function') {
                content = content();

            }

            element.append(content);
        }
    }

    /**
     * Renders an element
     *
     * @param {String} type
     * @param {Object} attributes
     * @param {Array} content
     *
     * @return {HTMLElement} Element
     */
    createElement(type, ...params) {
        let element = document.createElement(type);
        let attributes = {};
        let content = [];

        // The first parameter could be a collection of attributes
        if(params && params[0] && params[0].constructor === Object) {
            attributes = params.shift();
        }

        // The remaining parameters are content
        content = params;

        // Adopt all attributes
        for(let key in attributes) {
            let value = attributes[key];

            if(value === null || value === undefined || value === false) { continue; }

            if(typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
                element.setAttribute(key, value);
            } else {
                element[key] = value;
            }
        }
      
        // Append all content
        this.appendToElement(element, content);

        return element;
    }

    /**
     * Fetches the model
     */
    async fetch() {}
    
    /**
     * Resets the view
     */
    async reset() {
        this.state = {};

        await this.update();
    }

    /**
     * Updates the view
     */
    async update() {
        if(this.isUpdating) { return; }

        this.isUpdating = true;
        
        try {
            await this.fetch();

        } catch(e) {
            this.setErrorState(e);

        } finally {
            this.render();
            this.isUpdating = false;

        }
    }

    /**
     * Removes this element
     */
    remove() {
        if(!this.isValid()) { return; }

        this.element.parentElement.removeChild(this.element);
    }

    /**
     * Runs before rendering
     */
    prerender() {}
    
    /**
     * Runs after rendering
     */
    postrender() {}

    /**
     * Renders the template
     *
     * @return {HTMLElement} Element
     */
    render() {
        this.prerender();

        let output = super.render();
        let element = null;

        if(output instanceof Node) {
            element = output;

        } else if(typeof output === 'string') {
            let wrapper = document.createElement('div');
            wrapper.innerHTML = output;
            element = wrapper.firstElementChild; 
        
        }

        if(this.isValid() && element) {
            this.element.parentElement.replaceChild(element, this.element); 
        }

        this.element = element;

        this.postrender();
        
        return this.element;
    }
}

module.exports = ViewBase;
