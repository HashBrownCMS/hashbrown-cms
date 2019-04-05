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
    onChangeFile(files) {
        let numFiles = files ? files.length : 1;
       
        // In the case of a single file selected 
        if(numFiles == 1) {
            let file = files[0];

            let isImage =
                file.type == 'image/png' ||
                file.type == 'image/jpeg' ||
                file.type == 'image/gif';

            let isVideo =
                file.type == 'video/mpeg' ||
                file.type == 'video/mp4' ||
                file.type == 'video/quicktime' ||
                file.type == 'video/x-matroska';

            if(isImage) {
                let reader = new FileReader();
               
                this.setLoading(true);

                reader.onload = (e) => {
                    this.$element.find('.modal--media-uploader__preview').html(
                        _.img({src: e.target.result})
                    );


                    this.setLoading(false);
                }
                
                reader.readAsDataURL(file);
            }
                    
            if(isVideo) {
                this.$element.find('.modal--media-uploader__preview').html(
                    _.video({src: window.URL.createObjectURL(file), controls: 'controls'})
                );
            }

            debug.log('Previewing data of file type ' + file.type + '...', this);
        
        // Multiple files selected
        } else if(numFiles > 1) {
            this.$element.find('.media-preview').html(
                '(Multiple files selected)'
            );
        
        // No files selected
        } else if(numFiles == 0) {
            this.$element.find('.media-preview').html(
                '(No files selected)'
            );
        }
    }
    
    /**
     * Event: Submit
     *
     * @param {FormData} content
     * @param {Array} files
     */
    onSubmit(content, files) {
        if(!content || !files || files.length < 1) { return; }

        this.setLoading(true);

        let type = files[0].type;
        let apiPath = 'media/' + (this.replaceId ? 'replace/' + this.replaceId : 'new');
        let uploadedIds = [];

        // First upload the Media files
        return HashBrown.Helpers.RequestHelper.uploadFile(apiPath, type, content)

        // Then update the Media tree
        .then((ids) => {
            uploadedIds = ids;

            if(!uploadedIds || uploadedIds.length < 1) {
                return Promise.reject(new Error('File upload failed'));
            }

            if(!this.folder || this.folder === '/') {
                return Promise.resolve();
            }

            let queue = uploadedIds.slice(0);

            let putNextMediaIntoTree = () => {
                let id = queue.pop();

                if(!id) { return Promise.resolve(); }

                return HashBrown.Helpers.RequestHelper.request('post', 'media/tree/' + id, {
                    id: id,
                    folder: this.folder
                })
                .then(() => {
                    return putNextMediaIntoTree();
                });
            };

            return putNextMediaIntoTree();
        })

        // Then reload the Media resource
        .then(() => {
            return HashBrown.Helpers.ResourceHelper.reloadResource('media');
        })

        // Then update the UI and trigger the success callback
        .then(() => {
            this.setLoading(false);

            HashBrown.Views.Navigation.NavbarMain.reload();

            if(typeof this.onSuccess === 'function') {
                this.onSuccess(uploadedIds);
            }
            
            this.close();
        })
        .catch((e) => {
            UI.errorModal(e);

            this.setLoading(false);  
        });
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
                    this.onSubmit(newValue, newFiles);
                }
            }).$element
        ];
    }
}

module.exports = MediaUploader;
