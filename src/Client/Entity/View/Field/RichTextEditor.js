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
        
        if(this.model.config.wysiwygToolbar) {
            this.model.config.toolbar = this.model.config.wysiwygToolbar;
            delete this.model.config.wysiwygToolbar;
        }

        if(!this.model.config.toolbar) {
            this.model.config.toolbar = {};
        }

    }

    /**
     * Gets the field tools
     *
     * @return {Object} Tools
     */
    getTools() {
        return {
            fullscreen: {
                icon: this.state.isFullscreen ? 'compress' : 'expand',
                tooltip: 'Toggle full screen',
                handler: () => this.onClickFullscreen()
            }
        };
    }

    /**
     * Fetches view data
     */
    async fetch() {
        if(this.state.name === 'config') {
            let toolbarOptions = {};

            let categories = {
                paragraphs: 'Paragraphs',
                style: 'Style',
                lists: 'Lists'
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

            this.state.toolbarOptions = toolbarOptions;

            let toolbarValue = [];

            for(let label in toolbarOptions) {
                let key = toolbarOptions[label];

                if(this.model.config.toolbar && this.model.config.toolbar[key] === false) { continue; }

                toolbarValue.push(key);
            }

            this.state.toolbarValue = toolbarValue;


        } else {
            // Sanity check of value
            if(typeof this.state.value !== 'string') {
                this.state.value = this.state.value || '';
            }

            // Determine the initial active tab
            let tab = localStorage.getItem('rich-text-editor--tab') || 'visual';

            if(tab === 'html' && this.model.config.isHtmlDisabled) {
                tab = 'markdown';
            }
            
            if(tab === 'markdown' && this.model.config.isMarkdownDisabled) {
                tab = 'visual';
            }

            this.state.name = tab;
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
        this.state.name = 'visual';
        localStorage.setItem('rich-text-editor--tab', 'visual');

        this.render();
    }

    /**
     * Event: Click markdown tab
     */
    onClickMarkdownTab() {
        this.state.name = 'markdown';
        localStorage.setItem('rich-text-editor--tab', 'markdown');

        this.render();
    }

    /**
     * Event: Click HTML tab
     */
    onClickHtmlTab() {
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

            let html = media.getHtml();
            
            this.namedElements.input.insertHtml(html);
        });
    }

    /**
     * Event: Change config toolbar
     *
     * @param {Array} enabled
     */
    onChangeConfigToolbar(enabled) {
        if(!this.model.config.toolbar) {
            this.model.config.toolbar = {};
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
                delete this.model.config.toolbar[key];
            } else {
                this.model.config.toolbar[key] = false;
            }
        }

        this.onChange();
    }
}

module.exports = RichTextEditor;
