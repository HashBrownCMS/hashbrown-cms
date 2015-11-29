require('../client');
require('./partials/navbar');

$('.navbar-content').html(
    _.div({class: 'navbar navbar-default'},
        _.div({class: 'container'},
            _.ul({class: 'nav navbar-nav'},
                _.li(
                    _.a({href: '/'}, [
                        _.span({class: 'glyphicon glyphicon-arrow-left'}),
                        ' Logout'
                    ])
                )
            )
        )
    )
);

$('.page-content').html(
    _.div({class: 'container dashboard-container'},
        _.div({class: 'row'},
            _.div({class: 'col-md-4'},
                _.div({class: 'panel panel-primary'}, [
                    _.div({class: 'panel-heading'},
                        _.h4({class: 'panel-title'},
                            'putaitu.github.io'
                        )
                    ),
                    _.div({class: 'panel-body'}, [
                        _.p('Repo description'),
                        _.a({class: 'btn btn-primary center-block', href: '/repos/putaitu.github.io/deployment/'},
                            'Open'
                        )
                    ])
                ])
            )
        )
    )
);
