'use strict';

/**
 * A modal for uploading Media objects
 *
 * @memberof HashBrown.Client.Views.Modals
 */
class MediaUploader extends HashBrown.Views.Modals.Modal {
    /**
     * Constructor
     */
    constructor(params) {
        params.className = 'media-uploader';
        params.title = 'Upload a file';
        params.actions = false;

        super(params);

        HashBrown.Helpers.MediaHelper.checkMediaProvider()
        .catch((e) => {
            UI.errorModal(e);

            this.close();
        });
    }

    /**
     * Event: Change file
     */
    async onChangeFile(files) {
        let numFiles = files ? files.length : 1;
       
        let $preview = this.$element.find('.modal--media-uploader__preview');

        $preview.empty();
     
        if(!files || files.length < 1) { return; }
        
        this.setLoading(true);

        $preview.attr('data-file-count', files.length);

        for(let file of files) {
            let isImage = file.type.indexOf('image') === 0;
            let isVideo = file.type.indexOf('video') === 0;

            if(isImage) {
                let base64 = await HashBrown.Helpers.MediaHelper.convertFileToBase64(file);
                
                $preview.append(
                    _.img({src: 'data:' + file.type + ';base64,' + base64})
                );
            }
                    
            if(isVideo) {
                $preview.append(
                    _.video({src: window.URL.createObjectURL(file), controls: 'controls'})
                );
            }
        }

        this.setLoading(false);
    }
    
    /**
     * Event: Submit
     *
     * @param {Array} files
     */
    async onSubmit(files) {
        if(!files || files.length < 1) { return; }

        this.setLoading(true);

        try {
            let apiPath = 'media/' + (this.replaceId ? this.replaceId : 'new');

            let apiData = { files: [] };

            for(let file of files) {
                let fileData = {
                    filename: file.name,
                    base64: await HashBrown.Helpers.MediaHelper.convertFileToBase64(file)
                };

                apiData.files.push(fileData);
            }

            let ids = await HashBrown.Helpers.RequestHelper.request('post', apiPath, apiData);

            if(this.folder && this.folder !== '/') {
                for(let id of ids) {
                    await HashBrown.Helpers.RequestHelper.request('post', 'media/tree/' + id, { id: id, folder: this.folder });
                }
            }

            HashBrown.Helpers.EventHelper.trigger('resource');  

            this.setLoading(false);
            
            if(typeof this.onSuccess === 'function') {
                this.onSuccess(ids);
            }
                
            this.close();
        
        } catch(e) {
            UI.errorModal(e);

            this.setLoading(false);  
        
        }
    }

    /**
     * Render body
     *
     * @returns {HTMLElement} Body
     */
    renderBody() {
        return [
            _.div({class: 'modal--media-uploader__preview'}),
            new HashBrown.Views.Widgets.Input({
                type: 'file',
                name: 'media',
                useMultiple: !this.replaceId,
                onChange: (newValue) => {
                    this.onChangeFile(newValue);
                },
                onSubmit: (newValue, newFiles) => {
                    this.onSubmit(newFiles);
                }
            }).$element
        ];
    }
}

module.exports = MediaUploader;
