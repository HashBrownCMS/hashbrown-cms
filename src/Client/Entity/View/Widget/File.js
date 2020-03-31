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
    }

    /**
     * Event: Files changed
     */
    onChange(files) {
        let names = [];

        let submit = this.namedElements.submit;
        let placeholder = this.namedElements.placeholder;

        if(submit) {
            submit.classList.toggle('disabled', !files || files.length < 1);
        }

        if(files && files.length > 0) {
            for(let i = 0; i < files.length; i++) {
                names.push(files[i].name + ' (' + Math.round(files[i].size / 1000) + 'kb)');
            }
        }

        if(names.length > 0) {
            placeholder.innerHTML = names.join(', ');

        } else {
            placeholder.innerHTML = this.model.placeholder || '(no files selected)';
        }
       
        super.onChange(files);
    }

    /**
     * Event: Submit
     *
     * @param {Event} e
     */
    async onSubmit(e) {
        e.preventDefault();

        let input = this.namedElements[this.model.name];

        if(!input || !input.files || input.files.length < 1) { return; }

        if(typeof this.model.onsubmit !== 'function') { return; }

        let files = [];

        for(let data of input.files) {
            let file = {
                filename: data.name,
                size: data.size,
                type: data.type,
                base64: await HashBrown.Entity.Resource.Media.toBase64(data)
            };

            files.push(file);
        }

        this.model.onsubmit(files);

        return false;
    }
}

module.exports = File;
