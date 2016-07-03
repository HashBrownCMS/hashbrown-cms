'use strict';

// Views
let MessageModal = require('./MessageModal');

class MediaViewer extends View {
    constructor(params) {
        super(params);
        
        this.$element = _.div({class: 'media-viewer panel panel-default'});

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
        $.ajax({
            type: 'POST',
            url: apiUrl('media/tree/' + this.model.id),
            data: newFolder ? {
                id: this.model.id,
                folder: newFolder
            } : null,
            success: () => {
                reloadResource('media')
                .then(() => {
                    ViewHelper.get('NavbarMain').reload();
                });
            }
        });
    }

    render() {
        let view = this;

        this.$element.empty().append(
            _.div({class: 'media-heading'},
                _.h4(this.model.name)
            ),
            _.div({class: 'media-preview'},
                _.img({class: 'img-responsive', src: this.model.url})                    
            ),
            _.div({class: 'panel panel-default panel-buttons'}, 
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
