'use strict';

/**
 * An editor for rich text
 *
 * @memberof {HashBrown.Client.Entity.View.Field}
 */
class RichTextEditor extends HashBrown.Entity.View.Field.FieldBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.editorTemplate = require('template/field/editor/richTextEditor');
        this.configTemplate = require('template/field/config/richTextEditor');
    }

    /**
     * Fetches view data
     */
    async fetch() {
        if(this.state.name === 'config') {
            if(!this.model.config.wysiwygToolbar) {
                this.model.config.wysiwygToolbar = {};
            }
            
            let toolbarOptions = {};

            let categories = {
                paragraphs: 'Paragraphs',
                style: 'Style',
                lists: 'Lists',
                positioning: 'Positioning'
            };

            for(let key in categories) {
                let label = categories[key];
                let options = HashBrown.Entity.View.Widget.RichText.getToolbarElements(key);

                toolbarOptions[label] = '---';

                for(let key in options) {
                    let label = options[key];
                    
                    toolbarOptions[label] = key;
                }
            }
                
            this.state.wysiwygToolbarOptions = toolbarOptions;
           
            let toolbarValue = [];

            for(let label in toolbarOptions) {
                let key = toolbarOptions[label];

                if(this.model.config.wysiwygToolbar && this.model.config.wysiwygToolbar[key] === false) { continue; }

                toolbarValue.push(key);
            }
            
            this.state.wysiwygToolbarValue = toolbarValue;
           

        } else {
            // Sanity check of value
            if(typeof this.state.value !== 'string') {
                this.state.value = this.state.value || '';
            }

            // Make sure the string is HTML
            this.state.value = HashBrown.Service.MarkdownService.toHtml(this.state.value);

            let lastTab = localStorage.getItem('rich-text-editor--tab');

            if(lastTab === 'markdown' && !this.model.config.isMarkdownDisabled) {
                this.state.name = 'markdown';
                this.state.value = HashBrown.Service.MarkdownService.toMarkdown(this.state.value);
            
            } else if(lastTab === 'html' && !this.model.config.isHtmlDisabled) {
                this.state.name = 'html';

            }
        }
    }
    
    /**
     * Gets the value label
     *
     * @return {String}
     */
    getValueLabel() {
        var tmp = document.createElement('div');
        tmp.innerHTML = this.state.value || '';
        return tmp.textContent || tmp.innerText || super.getValueLabel();
    }
    
    /**
     * Event: Click visual tab
     */
    onClickVisualTab() {
        this.state.value = HashBrown.Service.MarkdownService.toHtml(this.state.value);
        this.state.name = 'visual';
        localStorage.setItem('rich-text-editor--tab', 'visual');
        
        this.render();
    }
    
    /**
     * Event: Click markdown tab
     */
    onClickMarkdownTab() {
        this.state.value = HashBrown.Service.MarkdownService.toMarkdown(this.state.value);
        this.state.name = 'markdown';
        localStorage.setItem('rich-text-editor--tab', 'markdown');

        this.render();
    }
    
    /**
     * Event: Click HTML tab
     */
    onClickHtmlTab() {
        this.state.value = HashBrown.Service.MarkdownService.toHtml(this.state.value);
        this.state.name = 'html';
        localStorage.setItem('rich-text-editor--tab', 'html');

        this.render();
    }
   
    /**
     * Event: Click insert media
     */
    onClickInsertMedia() {
        let mediaBrowser = HashBrown.Entity.View.Modal.MediaBrowser.new();

        mediaBrowser.on('pick', async (id) => {
            let media = await HashBrown.Entity.Resource.Media.get(id);
            
            if(!media) { return; }

            let html = '';

            if(media.isImage()) {
                html = '<img alt="' + media.name + '" src="/media/' + id + '/' + media.name + '">';
            } else if(media.isVideo()) {
                html = '<video alt="' + media.name + '" src="/media/' + id + '/' + media.name + '">';
            }

            let input = this.namedElements.input;

            if(input instanceof HashBrown.Entity.View.Widget.RichText) {
                input.insertHtml(html);
            
            } else if(input instanceof HashBrown.Entity.View.Widget.Text) {
                if(this.state.name === 'markdown') {
                    html = HashBrown.Service.MarkdownService.toMarkdown(html);
                }

                input.insertHtml(html);

            }
        });
    }

    /**
     * Event: Value changed
     *
     * @param {String} newValue
     */
    onChange(newValue) {
        if(this.state.name !== 'config') {
            newValue = HashBrown.Service.MarkdownService.toHtml(newValue);
        }
        
        super.onChange(newValue);
    }

    /**
     * Event: Change config WYSIWYG
     *
     * @param {Array} enabled
     */
    onChangeConfigWysiwyg(enabled) {
        if(!this.model.config.wysiwygToolbar) {
            this.model.config.wysiwygToolbar = {};
        }

        let keys = [];

        let categories = {
            paragraphs: 'Paragraphs',
            style: 'Style',
            lists: 'Lists',
            positioning: 'Positioning'
        };

        for(let key in categories) {
            let label = categories[key];
            let options = HashBrown.Entity.View.Widget.RichText.getToolbarElements(key);

            keys = keys.concat(Object.keys(options));
        }

        for(let key of keys) {
            if(enabled.indexOf(key) > -1) {
                delete this.model.config.wysiwygToolbar[key];
            } else {
                this.model.config.wysiwygToolbar[key] = false;
            }
        }

        this.onChange();
    }
}

module.exports = RichTextEditor;
