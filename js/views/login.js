require('../client');

function onSubmit(e) {
    e.preventDefault();

    var data = $(this).serialize();

    data.redirect = $(this).attr('action');

    $.post('/api/login/', data, function(res) {
        localStorage.setItem('gh-oauth-token', res.token);

        $.post('/api/orgs/', data, function(orgs) {
            function onClickEnter() {
                var sel = $('.orgs select');

                console.log(sel.val());
            }

            var divCred = $('.cred');
            var divOrgs = $('.orgs');

            divCred.toggleClass('hidden', true);
            divOrgs.toggleClass('hidden', false);

            divOrgs.append([
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
            _.div({class: 'panel-body cred'},
                _.form({action: req.query.sender || '/repos/'}, [
                    _.input({class: 'form-control', name: 'username', required: true, type: 'text', placeholder: 'Username'}),
                    _.input({class: 'form-control', name: 'password', required: true, type: 'password', placeholder: 'Password'}),
                    _.input({class: 'form-control btn btn-primary', type: 'submit', value: 'Login'})
                ]).on('submit', onSubmit)
            ),
            _.div({class: 'panel-body orgs hidden'})
        ])
    )
);
