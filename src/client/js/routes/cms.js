'use strict';

// Admins
Router.route('/admins/', function() {
    ViewHelper.get('NavbarMain').highlightItem('admins');

    $('.workspace').html(
        _.div({class: 'dashboard-container'},
            _.h1('Admins'),
            _.p('Hi'),
            _.button('Create').click(() => {
                $.ajax({
                    type: 'POST',
                    url: apiUrl('admin/new'),
                    data: {
                        username: 'hest',
                        password: 'test'
                    },
                    success: function() {
                        console.log('wooh!');
                    }
                });
            })
        )
    );
});

// About
Router.route('/about/', function() {
    ViewHelper.get('NavbarMain').highlightItem('about');

    $('.workspace').html(
        _.div({class: 'dashboard-container'},
            _.h1('Endomon'),
            _.p('The pluggable CMS')
        )
    );
});
