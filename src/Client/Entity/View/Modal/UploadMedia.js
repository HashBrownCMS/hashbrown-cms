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
        let connection = await HashBrown.Entity.Resource.Media.getProvider();
        
        if(!connection) {
            throw new Error('No media provider has been set for this project. Please make sure one of your connections has the "is media provider" setting switched on.');
        }  
    }

    /**
     * Event: Change file
     */
    async onChangeFile(files) {
        this.state.previews = [];

        for(let file of files) {
            file.isImage = file.type.indexOf('image') === 0;
            file.isVideo = file.type.indexOf('video') === 0;

            file.src = await HashBrown.Entity.Resource.Media.toSourceString(file);

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
            let resources = await HashBrown.Service.RequestService.request('post', apiPath, data);

            if(this.model.folder && this.model.folder !== '/') {
                for(let resource of resources) {
                    await HashBrown.Service.RequestService.request('post', 'media/tree/' + resource.id, { id: resource.id, folder: this.model.folder });
                }
            }

            HashBrown.Service.EventService.trigger('resource');  

            this.setLoading(false);
            
            this.trigger('success', resources);
                
            this.close();
        
        } catch(e) {
            this.setErrorState(e);
        
        }
    }
}

module.exports = UploadMedia;
