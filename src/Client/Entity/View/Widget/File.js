'use strict';

/**
 * A file input
 *
 * @memberof HashBrown.Client.Entity.View.Widget
 */
class File extends HashBrown.Entity.View.Widget.WidgetBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/widget/file');

        this.model.name = this.model.name || 'file';

        this.state.filenames = this.model.filenames || [];
    }
    
    /**
     * Update action buttons
     */
    updateActions() {
        let submit = this.namedElements.submit;

        if(submit) {
            submit.classList.toggle('disabled', this.state.filenames.length < 1);
        }

        let clear = this.namedElements.clear;

        if(clear) {
            clear.classList.toggle('disabled', this.state.filenames.length < 1);
        }
    
        let placeholder = this.namedElements.placeholder;

        if(placeholder) {
            if(this.state.filenames.length > 0) {
                placeholder.innerHTML = this.state.filenames.join(', ');
            
            } else if(this.model.placeholder) {
                placeholder.innerHTML = this.model.placeholder;
                
            } else {
                placeholder.innerHTML = '(no files selected)'; 
            
            }
        }
    }

    /**
     * Post render
     */
    postrender() {
        this.updateActions();
    }

    /**
     * Event: Files changed
     */
    onChange() {
        let files = this.getFiles();

        this.state.filenames = [];

        for(let file of files) {
            this.state.filenames.push(file.name);
        }
           
        super.onChange(files);
        
        this.updateActions();
    }

    /**
     * Event: Clear
     */
    onClear(e) {
        e.preventDefault();

        this.element.reset();

        this.onChange();
    }

    /**
     * Event: Submit
     */
    async onSubmit(e) {
        e.preventDefault();

        if(typeof this.model.onsubmit !== 'function') { return; }

        let files = this.getFiles();

        for(let i in files) {
            files[i] = {
                filename: files[i].name,
                size: files[i].size,
                type: files[i].type,
                base64: await HashBrown.Entity.Resource.Media.toBase64(files[i])
            };
        }

        this.model.onsubmit(files);

        return false;
    }

    /**
     * Gets a list of the files currently in the file input
     *
     * @return {Array} Files
     */
    getFiles() {
        let input = this.namedElements[this.model.name];
        
        if(!input || input.tagName !== 'INPUT' || input.type !== 'file') {
            throw new Error(`File input ${this.model.name} not found`);
        }

        return Array.from(input.files || []);
    }
}

module.exports = File;
