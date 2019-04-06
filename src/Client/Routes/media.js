'use strict';

// Dashboard
Crisp.Router.route('/media/', function() {
    HashBrown.Helpers.EventHelper.trigger('route');
    
    UI.setEditorSpaceContent(
        [
            _.h1('Media'),
            _.p('Right click in the Media pane to upload, edit and sort Media items.'),
            _.button({class: 'widget widget--button'}, 'Upload media')
                .click(() => {
                    new HashBrown.Views.Modals.MediaUploader({
                        onSuccess: (ids) => {
                            // We got one id back
                            if(typeof ids === 'string') {
                                location.hash = '/media/' + ids;

                            // We got several ids back
                            } else {
                                location.hash = '/media/' + ids[0];
                            
                            }
                        }
                    });
                })
        ],
        'text'
    );
});

// Preview
Crisp.Router.route('/media/:id', () => {
    HashBrown.Helpers.EventHelper.trigger('route');
    
    let mediaViewer = new HashBrown.Views.Editors.MediaViewer({
        modelId: Crisp.Router.params.id
    });
    
    UI.setEditorSpaceContent(mediaViewer.$element);
});
