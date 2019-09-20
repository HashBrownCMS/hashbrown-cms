'use strict';

// Parser cache
let cache = {};

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
    
        this.state.paragraphOptions = this.getParagraphOptions();
        this.state.viewHtml = this.toView(this.model.value);
    }

    /**
     * Event: Value changed
     */
    onChange() {
        let newValue = this.toValue(this.namedChildren.editor.innerHTML);

        super.onChange(newValue);
    }

    /**
     * Event: Silent change
     */
    onSilentChange() {
        this.updateElementTag();
    }

    /**
     * Insert HTML
     *
     * @param {String} html
     */
    insertHtml(html) {
        if(!html) { return; }

        this.namedChildren.editor.innerHTML += this.toView(html);

        this.onChange();
    };

    /**
     * Updates the paragraph picker and selection tag
     */
    updateElementTag () {
        let paragraphPicker = this.namedChildren.paragraph;
        
        if(!paragraphPicker) { return; }

        let selection = window.getSelection();

        if(!selection) { return; }

        let textNode = selection.anchorNode;

        if(!textNode) { return; }
        
        let parentElement = textNode.parentElement;
       
        if(!parentElement) { return; }
        
        let parentElementTagName = parentElement.tagName.toLowerCase();

        // If a media objects is involved, use it as reference
        if(textNode.children) {
            for(let i = 0; i < textNode.children.length; i++) {
                if(textNode.children[i].hasAttribute('src')) {
                    parentElementTagName = textNode.children[i].parentElement.tagName.toLowerCase();
                    break;
                }
            }
        }


        // If the parent tag is not a heading or a paragraph, default to paragraph
        if(!paragraphPicker.hasOption(parentElementTagName)) {
            parentElementTagName = 'p';
        }

        paragraphPicker.setValue(parentElementTagName);
    }

    /**
     * Converts HTML to view format, replacing media references
     *
     * @param {String} html
     *
     * @return {String} HTML
     */
    toView(html) {
        cache = {};
        
        if(!html) { return ''; }

        return html.replace(/src=".*media\/([a-z0-9]+)\/([^"]+)"/g, (original, id, filename) => {
            cache[id] = filename;
        
            return 'src="/media/' + HashBrown.Context.projectId + '/' + HashBrown.Context.environment + '/' + id + '"';
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
        
        // Replace media references
        html = html.replace(new RegExp('src="/media/' + HashBrown.Context.projectId + '/' + HashBrown.Context.environment + '/([a-z0-9]+)"', 'g'), (original, id) => {
            let filename = cache ? cache[id] : null;

            if(!filename) { return original; }
        
            return 'src="/media/' + id + '/' + filename + '"';
        });

        // Replace empty divs with pararaphs
        html = html.replace(/<div>/g, '<p>').replace(/<\/div>/g, '</p>');

        return html;
    }

    /**
     * Event: Change font color
     */
    onChangeFontColor(color) {
        document.execCommand('foreColor', false, color);
    }

    /**
     * Event: Change heading
     */
    onChangeHeading(newValue) {
        document.execCommand('heading', false, newValue);
        this.namedChildren.editor.focus();
        this.onChange();
    }

    /**
     * Event: On change style
     */
    onChangeStyle(newValue) {
        document.execCommand(newValue);
        this.onChange();
    }

    /**
     * Event: On remove format
     */
    onRemoveFormat() {
        document.execCommand('removeFormat');
        document.execCommand('unlink');
        this.onChange();
    }

    /**
     * Event: Create link
     */
    onCreateLink() {
        let selection = window.getSelection();
        let anchorOffset = selection.anchorOffset;
        let focusOffset = selection.focusOffset;
        let anchorNode = selection.anchorNode;
        let url = anchorNode.parentElement.getAttribute('href');
        let range = selection.getRangeAt(0);
        let text = selection.toString();
        let newTab = false;

        if(Math.abs(anchorOffset - focusOffset) < 1) {
            return UI.notify('Create link', 'Please select some text first');
        }

        let modal = UI.notify(
            'Create link for selection "' + text + '"',
            _.div({class: 'widget-group'},
                _.div({class: 'widget widget--label'}, 'URL'),
                new HashBrown.Entity.View.Widget.Text({
                    model: {
                        value: url,
                        onchange: (newValue) => { url = newValue; }
                    }
                }).element,
                new HashBrown.Entity.View.Widget.Checkbox({
                    model: {
                        placeholder: 'New tab',
                        onchange: (newValue) => { newTab = newValue; }
                    }
                }).element
            ),
            () => {
                if(!url) { return; }

                selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                document.execCommand('createLink', false, url);

                setTimeout(() => {
                    let a = selection.anchorNode.parentElement.querySelector('a');

                    if(!a) { return; }

                    if(newTab) {
                        a.setAttribute('target', '_blank');
                    } else {
                        a.removeAttribute('target');
                    }

                    this.onChange();
                }, 10);
            }
        );

        modal.$element.find('input:first-of-type').focus();
    }

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
                    indent: 'Indent',
                    outdent: 'Outdent',
                    alignLeft: 'Align left',
                    center: 'Center', 
                    justify: 'Justify',
                    alignRight: 'Align right'
                };
                break;
            
            default:
                throw new Error('WYSIWYG toolbar element category "' + category + '" not recognised');
        }

        return elements;
    }


    /**
     * Gets all paragraph options
     *
     * @returns {Object} Options
     */
    getParagraphOptions() {
        let options = this.constructor.getToolbarElements('paragraphs');

        for(let key in options) {
            if(this.model.toolbar[key] === false) { delete options[key]; }
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
