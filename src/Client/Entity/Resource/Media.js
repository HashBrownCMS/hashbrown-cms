'use strict';

/**
 * The media class
 */
class Media extends require('Common/Entity/Resource/Media') {
    /**
     * Gets the markup for diplaying this media entity
     *
     * @return {String} HTML
     */
    getHtml() {
        let html = '';

        let fullUrl = `/media/${HashBrown.Context.project.id}/${HashBrown.Context.environment}/${this.id}`;
        let thumbnailUrl = `${fullUrl}?thumbnail`;

        if(this.isImage()) {
            html = `<img title="${this.filename}" alt="${this.filename}" src="${fullUrl}">`;
        
        } else if(this.isVideo()) {
            html = `<video controls title="${this.filename}" src="${fullUrl}" poster="${thumbnailUrl}">`;
        
        } else if(this.isAudio()) {
            html = `<audio title="${this.filename}" src="${fullUrl}">`;
        
        } else {
            html = `<embed title="${this.filename}" src="${fullUrl}" type="${this.getContentTypeHeader()}">`;

        }

        return html;
    }

    /**
     * Converts a file to base64
     *
     * @param {File} file
     *
     * @return {String} Base64
     */
    static async toBase64(file) {
        checkParam(file, 'file', File, true);

        return await new Promise((resolve) => {
            let reader = new FileReader();
           
            reader.onload = (e) => {
                let base64 = e.target.result;

                base64 = base64.split('base64,')[1];

                resolve(base64);
            }
            
            reader.readAsDataURL(file);
        });
    }

    /**
     * Converts a file to a string representation
     *
     * @param {File} file
     *
     * @return {String} Source string
     */
    static async toSourceString(file) {
        checkParam(file, 'file', File, true);
        
        if(file.type.indexOf('video') === 0) {
            return window.URL.createObjectURL(file);

        } else if(file.type.indexOf('image') === 0) {
            return await new Promise((resolve) => {
                let reader = new FileReader();
               
                reader.onload = (e) => {
                    let base64 = e.target.result;

                    resolve(base64);
                }
                
                reader.readAsDataURL(file);
            });
        
        }

        return '';
    }
    
    /**
     * Saves the current state of this entity
     *
     * @param {Object} options
     */
    async save(options = {}) {
        let id = HashBrown.Service.NavigationService.getRoute(1) || this.id;
        let data = this.getObject();

        // Parts of the options object are long base64 strings,
        // so we're including them as part of the body instead of a query
        for(let key in options) {
            data[key] = options[key];
        }

        await HashBrown.Service.RequestService.request('post', this.category + '/' + id, data);
        
        HashBrown.Service.EventService.trigger('resource', this.id);
    }
}

module.exports = Media;
