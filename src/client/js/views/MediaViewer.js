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
     * Event: Click delete
     */
    onClickDelete() {
        let view = this;        
        let id = this.model.id;
        let name = this.model.name;
        
        function onSuccess() {
            debug.log('Removed media with id "' + id + '"', view); 
        
            reloadResource('media')
            .then(function() {
                ViewHelper.get('NavbarMain').reload();
                
                // Cancel the MediaViever view if it was displaying the deleted object
                if(location.hash == '#/media/' + id) {
                    location.hash = '/media/';
                }
            });
        }

        new MessageModal({
            model: {
                title: 'Delete media',
                body: 'Are you sure you want to delete the media object "' + name + '"?'
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default',
                    callback: function() {
                    }
                },
                {
                    label: 'OK',
                    class: 'btn-danger',
                    callback: function() {
                        $.ajax({
                            url: apiUrl('media/' + id),
                            type: 'DELETE',
                            success: onSuccess
                        });
                    }
                }
            ]
        });
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
        let view = this;
        let imgSrc = '/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + view.model.id;

        this.$element.empty().append(
            _.div({class: 'editor-header media-heading'},
                _.span({class: 'fa fa-file-image-o'}),
                _.h4({class: 'media-title'},
                    this.model.name,
                    _.span({class: 'media-data'})
                )
            ),
            _.div({class: 'media-preview editor-body'},
                _.img({class: 'img-responsive', src: imgSrc}).on('load', function() {
                    let img = new Image();
                    img.src = imgSrc;

                    view.$element.find('.media-data').html(
                        '(' + img.width + 'x' + img.height + ')'
                    );
                })
            ),
            _.div({class: 'editor-footer'}, 
                _.input({class: 'form-control', value: this.model.folder, placeholder: 'Type folder path here'})
                    .change(function() { view.onChangeFolder($(this).val()); }),
                _.div({class: 'btn-group'},
                    _.button({class: 'btn btn-danger btn-raised'},
                        'Delete'
                    ).click(function() { view.onClickDelete(); })
                )
            )
        );
    }
}

module.exports = MediaViewer;
