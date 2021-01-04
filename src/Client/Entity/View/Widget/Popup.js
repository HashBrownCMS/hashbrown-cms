'use strict';

/**
 * An popup menu
 *
 * @memberof HashBrown.Client.Entity.View.Widget
 */
class Popup extends HashBrown.Entity.View.Widget.WidgetBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);
        
        this.template = require('template/widget/popup');
    }

    /**
     * Fetches the model data
     */
    async fetch() {
        if(this.model.options) {
            if(typeof this.model.options === 'function') {
                this.model.options = await this.model.options();
            } else if(typeof this.model.options.then === 'function') {
                this.model.options = await this.model.options;
            }
        }
    }

    /**
     * Initialises this view
     */
    init() {
        // If this popup is a context menu, remove all other instances
        if(this.model.role === 'context-menu') {
            for(let menu of Array.from(document.querySelectorAll('.widget--popup[role="context-menu"]'))) {
                menu.parentElement.removeChild(menu);
            }

            this.state.isOpen = true;
        }

        super.init();
    }

    /**
     * Set the label before rendering
     */
    prerender() {
        let label = this.model.placeholder || '(none)';

        let labels = [];

        for(let key in this.model.options) {
            let value = this.model.options[key];
            let hasValue = (Array.isArray(this.model.value) && this.model.value.indexOf(value) > -1) || this.model.value === value;

            if(hasValue) {
                if(Array.isArray(this.model.options)) {
                    labels.push(value);
                } else {
                    labels.push(key);
                }
            }
        }

        if(labels.length > 0) {
            label = labels.join(', ');
        }

        this.state.value = label;
    }

    /**
     * Update position style post render
     */
    postrender() {
        this.updatePositionStyle();

        if(this.namedElements.input) {
            this.namedElements.input.focus();
        }
    }

    /**
     * Event: Click toggle
     */
    onClickToggle(e) {
        e.preventDefault();

        this.toggle();

        return false;
    }

    /**
     * Event: Click option
     */
    onClickOption(value) {
        if(typeof value === 'function') {
            value(this.model.target);
            this.toggle(false);
            this.render();

        } else {
            if(this.model.multiple) {
                if(!Array.isArray(this.model.value)) {
                    this.model.value = [];
                }

                let existingIndex = this.model.value.indexOf(value);

                if(existingIndex > -1) {
                    this.model.value.splice(existingIndex, 1);
                } else {
                    this.model.value.push(value);
                }

                this.model.value = this.model.value.filter((x) => !!x);
                this.model.value.sort();
                
                let scrollTop = this.element.querySelector('.widget--popup__options').scrollTop;

                this.render();
                
                this.element.querySelector('.widget--popup__options').scrollTop = scrollTop;
                this.onSearch(this.state.searchQuery);

            } else {
                this.model.value = value;
                this.toggle(false);

            }
        }

        this.onChange();
    }

    /**
     * Event: Search
     */
    onSearch(query = '') {
        this.state.searchQuery = query;

        query = query.toLowerCase();

        for(let option of Array.from(this.element.querySelectorAll('.widget--popup__option'))) {
            let label = option.innerHTML.toLowerCase();

            if(label.indexOf(query) > -1) {
                option.removeAttribute('style');    
            } else {
                option.style.display = 'none';
            }
        }

        this.updatePositionStyle();
    }

    /**
     * Event: Click clear value
     */
    onClickClearValue() {
        if(this.model.multiple) {
            this.model.value = [];
            
        } else {
            this.model.value = null;
        
        }

        this.render();

        this.onChange();
    }

    /**
     * Event: Click clear search
     */
    onClickClearSearch() {
        this.state.searchQuery = '';

        for(let option of Array.from(this.element.querySelectorAll('.widget--popup__option'))) {
            option.removeAttribute('style');    
        }
        
        let input = this.element.querySelector('input');

        if(input) {
            input.value = '';
        }
        
        this.updatePositionStyle();
    }

    /**
     * Toggles this popup open/closed
     *
     * @param {Boolean} isOpen
     */
    toggle(isOpen) {
        if(isOpen !== false && isOpen !== true) {
            isOpen = !this.state.isOpen;
        }
            
        this.state.isOpen = isOpen;
        this.state.searchQuery = '';
        
        this.render();

        if(isOpen) {
            this.trigger('opened');
        
            HashBrown.Service.EventService.on('escape', 'popup', () => { this.toggle(false); });

        } else {
            this.trigger('closed');

            if(this.model.role === 'context-menu') {
                this.remove();
            }
        }
    }

    /**
     * Updates position style
     */
    updatePositionStyle() {
        let menu = this.element.querySelector('.widget--popup__menu');
        
        if(!menu) { return; }

        let margin = parseFloat(getComputedStyle(document.documentElement).fontSize);

        menu.removeAttribute('style');
        menu.classList.remove('top');
        menu.classList.remove('bottom');
        menu.classList.remove('left');
        menu.classList.remove('right');
    
        let bounds = menu.getBoundingClientRect();
       
        // Establish scrolling bounds
        let yMin = 0;
        let yMax = window.innerHeight;
        let xMin = 0;
        let xMax = window.innerWidth;

        let parentElement = this.element.parentElement;

        while(parentElement) {
            if(window.getComputedStyle(parentElement).overflow === 'auto') {
                let parentBounds = parentElement.getBoundingClientRect();

                yMin = parentBounds.top;
                yMax = parentBounds.bottom;
                xMin = parentBounds.left;
                xMax = parentBounds.right;
                break;
            }

            parentElement = parentElement.parentElement;
        }

        // Apply appropriate classes
        if(this.model.role === 'context-menu') {
            if(bounds.right > xMax - margin) {
                menu.classList.add('right');
            } else {
                menu.classList.add('left');
            }
        } else {
            if(bounds.left < xMin + margin) {
                menu.classList.add('left');
            } else {
                menu.classList.add('right');
            }
        }
      
        if(bounds.bottom > yMax - margin && bounds.top - bounds.height > yMin + margin) {
            menu.classList.add('bottom');
        } else {
            menu.classList.add('top');
        }
      
        // Make final adjustment in case the menu is too tall for the screen
        bounds = menu.getBoundingClientRect();
        
        if(bounds.bottom > yMax - margin) {
            menu.style.height = (yMax - bounds.top - margin) + 'px';
        }
    }

    /**
     * Gets whether this popup has an option
     *
     * @param {String} value
     *
     * @return {Boolean} has option
     */
    hasOption(value) {
        return Object.values(this.model.options || {}).indexOf(value) > -1;
    }
}

module.exports = Popup;
