'use strict';

/**
 * A modal for uploading Media objects
 *
 * @memberof HashBrown.Entity.Client.View.Modal
 */
class UploadMedia extends HashBrown.Entity.View.Modal.ModalBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/modal/uploadMedia');
    }

    /**
     * Fetches dependencies
     */
    async fetch() {
        await HashBrown.Service.MediaService.checkMediaProvider();
    }

    /**
     * Event: Change file
     */
    async onChangeFile(files) {
        this.state.previews = [];

        for(let file of files) {
            file.isImage = file.type.indexOf('image') === 0;
            file.isVideo = file.type.indexOf('video') === 0;

            if(!file.isImage && !file.isVideo) { continue; }

            if(file.isImage) {
                let base64 = await HashBrown.Service.MediaService.convertFileToBase64(file);
                
                file.src = 'data:' + file.type + ';base64,' + base64;
            }
                    
            if(file.isVideo) {
                file.src = window.URL.createObjectURL(file);
            }

            this.state.previews.push(file);
        }
        
        this.renderPartial('preview');

    }
    
    /**
     * Event: Submit
     *
     * @param {FormData} data
     */
    async onSubmit(data) {
        this.setLoading(true);

        try {
            let apiPath = 'media/' + (this.model.replaceId ? this.model.replaceId : 'new');
            let ids = await HashBrown.Service.RequestService.upload(apiPath, data);

            if(this.model.folder && this.model.folder !== '/') {
                for(let id of ids) {
                    await HashBrown.Service.RequestService.request('post', 'media/tree/' + id, { id: id, folder: this.model.folder });
                }
            }

            HashBrown.Service.EventService.trigger('resource');  

            this.setLoading(false);
            
            this.trigger('success', ids);
                
            this.close();
        
        } catch(e) {
            this.setErrorState(e);
        
        }
    }
}

module.exports = UploadMedia;
