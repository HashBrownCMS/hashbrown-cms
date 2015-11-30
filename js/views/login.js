require('../client');

function onSubmit(e) {
    e.preventDefault();

    var data = $(this).serialize();

    data.redirect = $(this).attr('action');

    $.post('/api/login/', data, function(val) {
        console.log(val);
    });
}

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
                    _.input({class: 'form-control', name: 'username', type: 'text', placeholder: 'Username'}),
                    _.input({class: 'form-control', name: 'password', type: 'password', placeholder: 'Password'}),
                    _.input({class: 'form-control btn btn-primary', type: 'submit', value: 'Login'})
                ]).on('submit', onSubmit)
            )
        ])
    )
);
