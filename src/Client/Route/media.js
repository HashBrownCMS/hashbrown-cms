'use strict';

// Dashboard
Crisp.Router.route('/media/', function() {
    HashBrown.Service.EventService.trigger('route');
    
    UI.setEditorSpaceContent(
        [
            _.h1('Media'),
            _.p('Right click in the Media pane to upload, edit and sort Media items.'),
            _.button({class: 'widget widget--button'}, 'Upload media')
                .click(() => {
                    let modal = new HashBrown.Entity.View.Modal.UploadMedia();

                    modal.on('success', (ids) => {
                        // We got one id back
                        if(typeof ids === 'string') {
                            location.hash = '/media/' + ids;

                        // We got several ids back
                        } else {
                            location.hash = '/media/' + ids[0];
                        
                        }
                    });
                })
        ],
        'text'
    );
});

// Preview
Crisp.Router.route('/media/:id', () => {
    HashBrown.Service.EventService.trigger('route');
    
    let mediaViewer = new HashBrown.View.Editor.MediaViewer({
        modelId: Crisp.Router.params.id
    });
    
    UI.setEditorSpaceContent(mediaViewer.$element);
});
