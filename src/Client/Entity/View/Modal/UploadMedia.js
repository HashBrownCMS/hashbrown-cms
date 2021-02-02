'use strict';

/**
 * A modal for uploading Media objects
 *
 * @memberof HashBrown.Client.Entity.View.Modal
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
       
        this.trigger('change', files);

        this.renderPartial('preview');

    }
    
    /**
     * Event: Submit
     *
     * @param {Array} files
     */
    async onSubmit(files) {
        this.setLoading(true);

        let apiPath = 'media/' + (this.model.replaceId ? this.model.replaceId : 'new');

        let resources = [];
        let errors = 0;
        
        for(let i in files) {
            let file = files[i];
            let element = this.namedElements.previews.children[i];
       
            if(element) {
                element.dataset.state = 'uploading';
            }

            try {
                let resource = await HashBrown.Service.RequestService.request(
                    'post',
                    apiPath,
                    {
                        folder: this.model.folder,
                        filename: file.filename,
                        full: file.base64
                    }
                );
                
                element.dataset.state = 'success';

                resources.push(resource);

            } catch(e) {
                element.dataset.state = 'error';
                element.setAttribute('title', e.message);

                errors++;
            }
        }

        HashBrown.Service.EventService.trigger('resource');  

        this.setLoading(false);
        
        this.trigger('success', resources);
            
        if(errors < 1) {
            this.close();
        }
    }
}

module.exports = UploadMedia;
