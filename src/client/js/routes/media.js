'use strict';

// Dashboard
Router.route('/media/', function() {
    ViewHelper.get('NavbarMain').showTab('/media/');
    
    $('.workspace').html(
        _.div({class: 'dashboard-container'},
            _.h1('Media dashboard'),
            _.p('Please click on a media object to proceed'),
            _.button({class: 'btn btn-primary'},
                'Upload media'
            ).click(() => {
                ViewHelper.get('NavbarMain').mediaPane.onClickUploadMedia();
            })
        )
    );
});

// Preview
Router.route('/media/:id', function() {
    let mediaViewer = new MediaViewer({
        modelUrl: apiUrl('media/' + this.id)
    });
    
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(mediaViewer.$element);
});
