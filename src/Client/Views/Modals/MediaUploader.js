'use strict';

const Media = require('Common/Models/Media');

const MediaHelper = require('Client/Helpers/MediaHelper');
const RequestHelper = require('Client/Helpers/RequestHelper');
const ProjectHelper = require('Client/Helpers/ProjectHelper');
const SettingsHelper = require('Client/Helpers/SettingsHelper');

/**
 * A modal for uploading Media objects
 *
 * @memberof HashBrown.Client.Views.Modal
 */
class MediaUploader extends View {
    constructor(params) {
        super(params);

        this.fetch();
    }
    
    /**
     * Gets whether the Media provider exists
     *
     * @returns {Promise} Promise
     */
    static checkMediaProvider() {
        return SettingsHelper.getSettings(ProjectHelper.currentProject, ProjectHelper.currentEnvironment, 'providers')
        .then((result) => {
            if(!result || !result.media) {
                return Promise.reject(new Error('No Media provider has been set for this project. Please make sure one of your <a href="#/connections/">Connections</a> have the "is Media provider" parameter switched on.'));
            }  

            return Promise.resolve();
        }); 
    }

    /**
     * Renders the Media uploader
     */
    render() {
        MediaUploader.checkMediaProvider()
        .then(() => {
            // Event: Change file
            let onChangeFile = () => {
                let input = $(this);
                let numFiles = this.files ? this.files.length : 1;
               
                // In the case of a single file selected 
                if(numFiles == 1) {
                    let file = this.files[0];

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
                        
                        uploadModal.$element.find('.spinner-container').toggleClass('hidden', false);

                        reader.onload = function(e) {
                            uploadModal.$element.find('.media-preview').html(
                                _.img({src: e.target.result})
                            );


                            uploadModal.$element.find('.spinner-container').toggleClass('hidden', true);
                        }
                        
                        reader.readAsDataURL(file);
                    }
                            
                    if(isVideo) {
                        uploadModal.$element.find('.media-preview').html(
                            _.video({src: window.URL.createObjectURL(file), controls: 'controls'})
                        );
                    }

                    debug.log('Previewing data of file type ' + file.type + '...', this);
                
                // Multiple files selected
                } else if(numFiles > 1) {
                    uploadModal.$element.find('.media-preview').html(
                        '(Multiple files selected)'
                    );
                
                // No files selected
                } else if(numFiles == 0) {
                    uploadModal.$element.find('.media-preview').html(
                        '(No files selected)'
                    );
                }
            }
           
            // Event: Click upload
            let onClickUpload = () => {
                uploadModal.$element.find('form').submit();

                return false;
            }

            // Event: Submit
            let onSubmit = (e, content) => {
                e.preventDefault();

                uploadModal.$element.find('.spinner-container').toggleClass('hidden', false);

                let apiPath = 'media/' + (this.replaceId ? 'replace/' + this.replaceId : 'new');
                let uploadedIds = [];

                // First upload the Media files
                // TODO: Use the RequestHelper for this
                return new Promise((resolve, reject) => {
                    $.ajax({
                        url: RequestHelper.environmentUrl(apiPath),
                        type: 'POST',
                        data: new FormData(content),
                        processData: false,
                        contentType: false,
                        success: (ids) => {
                            uploadedIds = ids || [];

                            resolve();
                        },
                        error: (e) => {
                            reject(e);            
                        }
                    })
                })

                // Then update the Media tree
                .then(() => {
                    if(!this.folder || this.folder === '/') {
                        return Promise.resolve();
                    }

                    let queue = uploadedIds.slice(0);

                    let putNextMediaIntoTree = () => {
                        let id = queue.pop();

                        if(!id) { return Promise.resolve(); }

                        return RequestHelper.request('post', 'media/tree/' + id, {
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
                    return RequestHelper.reloadResource('media');
                })

                // Then update the UI and trigger the success callback
                .then(() => {
                    uploadModal.$element.find('.spinner-container').toggleClass('hidden', true);

                    HashBrown.Views.Navigation.NavbarMain.reload();

                    if(typeof this.onSuccess === 'function') {
                        this.onSuccess(uploadedIds);
                    }
                    
                    uploadModal.hide();
                });
            }

            // Render the upload modal
            let uploadModal = new HashBrown.Views.Modals.MessageModal({
                model: {
                    class: 'modal-upload-media',
                    title: 'Upload a file',
                    body: [
                        _.div({class: 'spinner-container hidden'},
                            _.span({class: 'spinner fa fa-refresh'})
                        ),
                        _.div({class: 'media-preview'}),
                        _.form({class: 'form-control'},
                            _.input({type: 'file', name: 'media', multiple: this.replaceId ? false : true})
                                .change((e) => {
                                    if(typeof this.onChangeFile === 'function') {
                                        this.onChangeFile(e);
                                    }
                                })
                        ).submit(function(e) { onSubmit(e, this); })
                    ]
                },
                buttons: [
                    {
                        label: 'Cancel',
                        class: 'btn-default',
                        callback: this.onCancel
                    },
                    {
                        label: 'Upload',
                        class: 'btn-primary',
                        callback: onClickUpload
                    }
                ]
            });

            // Event: Close modal
            uploadModal.on('close', () => {
                if(typeof this.onCancel === 'function') {
                    this.onCancel();
                } 
            });
        })
        .catch(UI.errorModal);
    }
}

module.exports = MediaUploader;
