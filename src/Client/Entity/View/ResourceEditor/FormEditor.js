'use strict';

/**
 * The editor for form resources
 */
class FormEditor extends HashBrown.Entity.View.ResourceEditor.ResourceEditorBase {
    static get category() { return 'forms'; }
    
    /**
     * Constructor
     */
    constructor(params) {
        super(params);
        
        this.template = require('template/resourceEditor/formEditor.js');
    }

    /**
     * Pre render
     */
    prerender() {
        if(this.state.name) { return; }

        this.state.icon = 'wpforms';
        this.state.postUrl = location.protocol + '//' + location.hostname + '/api/' + HashBrown.Context.projectId + '/' + HashBrown.Context.environment + '/forms/' + this.model.id + '/submit';

        this.state.inputs = {};

        for(let key in this.model.inputs || {}) {
            this.state.inputs[key] = key;
        }
    }

    /**
     * Event: Click copy post url
     */
    onClickCopyPostUrl() {
        copyToClipboard(this.state.postUrl);

        UI.notifySmall('POST URL copied to clipboard', null, 3);
    }

    /**
     * Event: Click start tour
     */
    async onClickStartTour() {
        if(location.hash.indexOf('forms/') < 0) {
            location.hash = '/forms/';
        }
       
        await new Promise((resolve) => { setTimeout(() => { resolve(); }, 500); });
            
        await UI.highlight('.navigation--resource-browser__tab[href="#/forms/"]', 'This the forms section, where user submitted content lives.', 'right', 'next');

        await UI.highlight('.panel', 'Here you will find all of your forms. You can right click here to create a new form.', 'right', 'next');
        
        await UI.highlight('.resource-editor', 'This is the form editor, where you edit forms.', 'left', 'next');
    }

    /**
     * Event: Click clear entries
     */
    async onClickClearEntries() {
        UI.confirm('Clear "' + this.model.title + '"', 'Are you sure you want to clear all entries?', async () => {
            await HashBrown.Service.RequestService.request('post', 'forms/clear/' + this.model.id);

            this.model.entries = [];
        });
    }

    /**
     * Event: Click download entries
     */
    onClickDownloadEntries() {
        location = HashBrown.Service.RequestService.environmentUrl('forms/' + this.model.id + '/entries');
    }

    /**
     * Event: Change title
     */
    onChangeTitle(newValue) {
        this.model.title = newValue;

        this.onChange();
    }
    
    /**
     * Event: Change allowed origin
     */
    onChangeAllowedOrigin(newValue) {
        this.model.allowedOrigin = newValue;

        this.onChange();
    }
    
    /**
     * Event: Change redirect URL
     */
    onChangeRedirect(newValue) {
        this.model.redirect = newValue;

        this.onChange();
    }
    
    /**
     * Event: Change append redirect URL
     */
    onChangeAppendRedirect(newValue) {
        this.model.appendRedirect = newValue;

        this.onChange();
    }

    /**
     * Event: Click input
     */
    onClickEditInput(key) {
        if(!this.model.inputs) { this.model.inputs = {}; }

        let modal = HashBrown.Entity.View.Modal.EditFormInput.new({
            model: {
                key: key,
                definition: this.model.inputs[key]
            }
        });
        
        modal.on('changekey', (newKey) => {
            this.onChangeInputKey(key, newKey);

            key = newKey;

            this.render();
        });

        modal.on('change', (newValue) => {
            this.onChangeInputDefinition(key, newValue);
        });
    }

    /**
     * Event: Change input sort order
     */
    onChangeInputSorting(inputs) {
        let newInputs = {};

        for(let key in inputs) {
            let value = this.model.inputs[key];

            newInputs[key] = value || { type: 'text' };
        }

        let isNewInput = Object.keys(inputs).length > Object.keys(this.model.inputs).length;
        
        this.model.inputs = newInputs;
        
        if(isNewInput) {
            this.onClickEditInput(Object.keys(inputs).pop());
        }
        
        this.onChange();
    }
    
    /**
     * Event: Change input key
     */
    onChangeInputKey(oldKey, newKey) {
        let keys = Object.keys(this.model.inputs);

        let newInputs = {};

        for(let key of keys) {
            let value = this.model.inputs[key];

            if(key === oldKey) { key = newKey; }

            newInputs[key] = value;
        }

        this.model.inputs = newInputs;

        this.onChange();
    }

    /**
     * Event: Change input definition
     */
    onChangeInputDefinition(key, newValue) {
        if(!this.model.inputs) { this.model.inputs = {}; }
       
        this.model.inputs[key] = newValue;

        this.onChange();
    }
}

module.exports = FormEditor;
