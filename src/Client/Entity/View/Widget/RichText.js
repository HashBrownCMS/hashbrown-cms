'use strict';

/**
 * A rich text widget
 *
 * @memberof HashBrown.Client.Entity.View.Widget
 */
class RichText extends HashBrown.Entity.View.Widget.WidgetBase  {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/widget/richText'); 

        this.model.toolbar = this.getToolbarOptions();
        this.state.paragraphOptions = this.getParagraphOptions();
    }

    /**
     * Fetches the model
     */
    async fetch() {
        let deployer = await HashBrown.Entity.Resource.Media.getDeployer();

        if(deployer) {
            this.state.mediaPath = '/' + deployer.path.split('/').filter(Boolean).join('/');
        } else {
            this.state.mediaPath = '/media';
        }
    }

    /**
     * Post render
     */
    postrender() {
        if(this.model.disabled) {
            return this.namedElements.editor.innerHTML = this.toView(this.model.value);
        }
      
        this.initEditor();
    }

    /**
     * Initialises the editor
     */
    initEditor() {}

    /**
     * Event: Value changed
     */
    onChange() {
        let newValue = this.toValue(this.getHtml());

        super.onChange(newValue);
    }

    /**
     * Insert HTML
     *
     * @param {String} html
     */
    insertHtml(html) {}

    /**
     * Gets the HTML value
     *
     * @return {String} HTML
     */
    getHtml() {
        return this.namedElements.editor.innerHTML;
    }

    /**
     * Updates the paragraph picker and selection tag
     */
    updateParagraphTag () {}

    /**
     * Converts HTML to view format, replacing media references
     *
     * @param {String} html
     *
     * @return {String} HTML
     */
    toView(html) {
        if(!html) { return ''; }

        return this.replaceMediaReferences(html, (id, filename) => {
            return `/media/${this.context.project.id}/${this.context.environment}/${id}`;
        });
    }

    /**
     * Converts HTML to value format, replacing media references
     *
     * @param {String} html
     *
     * @return {String} HTML
     */
    toValue(html) {
        if(!html) { return ''; }
        
        return this.replaceMediaReferences(html, (id, filename) => {
            return `${this.state.mediaPath}/${id}/${filename}`;
        });
    }

    /**
     * Replaces media references
     *
     * @param {String} html
     * @param {Function} urlHandler
     *
     * @return {String} HTML
     */
    replaceMediaReferences(html, urlHandler) {
        if(!html || !urlHandler) { return html; }
        
        return html.replace(/<[^>]*src="[^"]+"[^>]*>(<\/[^>]*>)?/g, (elementHtml) => {
            let temp = document.createElement('div');
            temp.innerHTML = elementHtml;

            let element = temp.firstChild;

            let id = null;
            let filename = element.getAttribute('title') || element.getAttribute('alt');
            let source = element.getAttribute('src');

            if(source.indexOf('http') === 0 || source.indexOf('//') === 0) {
                return elementHtml;
            }

            let sourceParts = element.getAttribute('src').split('/');

            for(let part of sourceParts) {
                if(part.indexOf('.') > -1) {
                    filename = part;
                } else {
                    id = part;
                }
            }

            element.setAttribute('title', filename);
            element.setAttribute('alt', filename);
            element.setAttribute('src', urlHandler(id, filename));
            
            return element.outerHTML;
        });
    }

    /**
     * Event: Change paragraph
     *
     * @param {String} tagName
     */
    onChangeParagraph(tagName) {}

    /**
     * Event: Click bold
     */
    onClickBold() {} 

    /**
     * Event: Click italic
     */
    onClickItalic() {}

    /**
     * Event: Click quotation
     */
    onClickQuotation() {}
    
    /**
     * Event: Click code
     */
    onClickCode() {}

    /**
     * Event: Click ordered list
     */
    onClickOrderedList() {}
    
    /**
     * Event: Click unordered list
     */
    onClickUnorderedList() {}

    /**
     * Event: Click remove format
     */
    onClickRemoveFormat() {}

    /**
     * Event: Create link
     */
    onClickLink() {}

    /**
     * Gets toolbar elements
     *
     * @param {String} category
     *
     * @return {Array} Elements
     */
    static getToolbarElements(category) {
        checkParam(category, 'category', String, true);

        let elements = {};

        switch(category) {
            case 'paragraphs':
                elements = {
                    h1: 'Header 1',
                    h2: 'Header 2',
                    h3: 'Header 3',
                    h4: 'Header 4',
                    h5: 'Header 5',
                    h6: 'Header 6'
                };
                break;
            
            case 'blocks':
                elements = {
                    quotation: 'Quotation',
                    code: 'Code'
                };
                break;

            case 'style':
                elements = {
                    bold: 'Bold',
                    italic: 'Italic',
                    underline: 'Underline',
                    color: 'Color'
                };
                break;
            
            case 'lists':
                elements = {
                    orderedList: 'Ordered',
                    unorderedList: 'Unordered'
                };
                break;
            
            case 'positioning':
                elements = {
                    alignLeft: 'Align left',
                    center: 'Center', 
                    justify: 'Justify',
                    alignRight: 'Align right'
                };
                break;
            
            default:
                throw new Error('Toolbar element category "' + category + '" not recognised');
        }

        return elements;
    }

    /**
     * Gets the toolbar options
     *
     * @return {Object} Options
     */
    getToolbarOptions() {
        if(!this.model.toolbar) { return {}; }
    
        return JSON.parse(JSON.stringify(this.model.toolbar));
    }

    /**
     * Gets all paragraph options
     *
     * @returns {Object} Options
     */
    getParagraphOptions() {
        let options = this.constructor.getToolbarElements('paragraphs');

        for(let key in options) {
            if(!this.model.toolbar || this.model.toolbar[key] === false) { delete options[key]; }
        }
       
        options.p = 'Paragraph';

        // Reverse keys and values for the popup widget
        for(let key in options) {
            let value = options[key];

            delete options[key];

            options[value] = key;
        }

        return options;
    }
}

module.exports = RichText;
