require('../client');

$('.page-content').html(
    _.div({class: 'container'},
        _.div({class: 'panel panel-primary'}, [
            _.div({class: 'panel-heading'},
                _.h4({class: 'panel-title'},
                    'Putaitu CMS'
                )
            ),
            _.div({class: 'panel-body'},
                _.form({action: req.query.sender || '/repos/'}, [
                    _.input({class: 'form-control', type: 'text', placeholder: 'Username'}),
                    _.input({class: 'form-control', type: 'password', placeholder: 'Password'}),
                    _.input({class: 'form-control btn btn-primary', type: 'submit', value: 'Login'})
                ])
            )
        ])
    )
);
