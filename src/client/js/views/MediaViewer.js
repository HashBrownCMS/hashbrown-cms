'use strict';

// Views
let MessageModal = require('./MessageModal');

class MediaViewer extends View {
    constructor(params) {
        super(params);
        
        this.$element = _.div({class: 'editor media-viewer'});

        this.fetch();
    }

    /**
     * Event: On change folder path
     *
     * @param {String} newFolder
     */
    onChangeFolder(newFolder) {
        apiCall(
            'post',
            'media/tree/' + this.model.id,
            newFolder ? {
                id: this.model.id,
                folder: newFolder
            } : null
        )
        .then(() => {
            return reloadResource('media');
        })
        .then(() => {
            ViewHelper.get('NavbarMain').reload();
        })
        .catch(errorModal);
    }

    render() {
        this.model = new Media(this.model);        

        let mediaSrc = '/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + this.model.id;

        this.$element.empty().append(
            _.div({class: 'editor-header media-heading'},
                _.span({class: 'fa fa-file-image-o'}),
                _.h4({class: 'media-title'},
                    this.model.name,
                    _.span({class: 'media-data'},
                        this.model.getContentTypeHeader()    
                    )
                )
            ),
            _.div({class: 'media-preview editor-body'},
                _.if(this.model.isImage(),
                    _.img({src: mediaSrc})
                ),
                _.if(this.model.isVideo(),
                    _.video({controls: true, src: mediaSrc})
                )
            ),
            _.div({class: 'editor-footer'}, 
                _.input({class: 'form-control', value: this.model.folder, placeholder: 'Type folder path here'})
                    .change((e) => { this.onChangeFolder($(e.target).val()); })
            )
        );
    }
}

module.exports = MediaViewer;
