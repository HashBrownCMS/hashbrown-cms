require('../client');

function onSubmit(e) {
    e.preventDefault();

    var data = $(this).serialize();

    $('.panel-body .btn').toggleClass('disabled', true).val('Loading...');

    $.post('/api/login/', data, function(res) {
        console.log(res);

        if(res.err) {
            alert(res.err.json.message);
            $('.panel-body .btn').toggleClass('disabled', false).val('Login');
        
        } else {
            $.post('/api/orgs/', data, function(orgs) {
                localStorage.setItem('gh-oauth-token', res.token);

                function onClickEnter() {
                    var sel = $('.panel-body select');

                    location = '/repos/' + sel.val();
                }

                $('.panel-body').empty();
                $('.panel-body').append([
                    _.select({class: 'form-control'},
                        _.each(
                            orgs,
                            function(i, org) {
                                return _.option({value: org.login}, org.login);
                            }
                        )
                    ),
                    _.button({class: 'btn btn-primary form-control'},
                        'Enter'
                    ).click(onClickEnter)
                ]);
            
                console.log(orgs);
            });
        } 
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
                    _.input({class: 'form-control', name: 'username', required: true, type: 'text', placeholder: 'Username'}),
                    _.input({class: 'form-control', name: 'password', required: true, type: 'password', placeholder: 'Password'}),
                    _.input({class: 'form-control btn btn-primary', type: 'submit', value: 'Login'})
                ]).on('submit', onSubmit)
            )
        ])
    )
);
