require('../client');

class Repos extends View {
    constructor(args) {
        super(args);

        let view = this;

        api.repos(function(repos) {
            view.repos = repos;

            view.init();
        });
    }

    render() {
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
                    _.each(
                        this.repos,
                        function(i, repo) {
                            return _.div({class: 'col-md-4'},
                                _.div({class: 'panel panel-primary'}, [
                                    _.div({class: 'panel-heading'},
                                        _.h4({class: 'panel-title'},
                                            repo.name
                                        )
                                    ),
                                    _.div({class: 'panel-body'}, [
                                        _.p(repo.description),
                                        _.a({class: 'btn btn-primary center-block', href: '/repos/' + repo.fullName + '/deployment/'},
                                            'Open'
                                        )
                                    ])
                                ])
                            );
                        }
                    )
                )
            )
        );
    }
}

new Repos();
