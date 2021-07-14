'use strict';

/**
 * The media class
 *
 * @memberof HashBrown.Client.Entity.Resource
 */
class Media extends require('Common/Entity/Resource/Media') {
    static get useCaching() { return true; }
    
    /**
     * Gets the media deployer
     *
     * @return {Object} Deployer
     */
    static async getDeployer() {
        let context = HashBrown.Client.context;
        let deployer = await context.project.getEnvironmentSettings(context.environment, 'mediaDeployer');
        
        if(!deployer || !deployer.alias) { return null; }

        return deployer;
    }
    
    /**
     * Gets the markup for diplaying this media entity
     *
     * @return {String} HTML
     */
    getHtml() {
        let html = '';

        let fullUrl = `/media/${this.context.project.id}/${this.context.environment}/${this.id}`;
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
        let id = options.id || this.id;
        let data = this.getObject();

        // Parts of the options object are long base64 strings,
        // so we're including them as part of the body instead of a query
        for(let key in options) {
            data[key] = options[key];
        }

        await HashBrown.Service.RequestService.request('post', this.library + '/' + id, data);
        
        HashBrown.Service.EventService.trigger('resource', this.id);
    }

    /**
     * Waits for an image to load
     *
     * @param {String} url
     * @param {Boolean} ignoreErrors
     */
    static waitForImage(url, ignoreErrors = false) {
        if(!url) { return; }

        return new Promise((resolve, reject) => {
            let img = new Image();
            
            img.onload = resolve;

            if(ignoreErrors) {
                img.onerror = resolve;
            } else {
                img.onerror = reject;
            }

            img.src = url;
        });
    }
}

module.exports = Media;
