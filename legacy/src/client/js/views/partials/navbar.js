class Navbar extends View {
    constructor(args) {
        super(args);
    
        let view = this;

        api.repo(function(repo) {
           view.repo = repo;

           view.init();
        });
    }

    render() {
        let view = this;

        $('.navbar-content').html(
            _.div({class: 'navbar navbar-default'},
                _.div({class: 'container'}, [
                    _.if(!env.local.menu.hide.all, 
                        _.ul({class: 'nav navbar-nav'}, [
                            _.li(
                                _.a({href: '/repos/' + req.params.user}, [
                                    _.span({class: 'glyphicon glyphicon-arrow-left'}),
                                    ' Repos'
                                ])
                            ),
                            _.if(!env.local.menu.hide.deployment,
                                _.li(
                                    _.a({href: '/repos/' + req.params.user + '/' + req.params.repo + '/deployment/'}, [
                                        _.span({class: 'glyphicon glyphicon-upload'}),
                                        ' Deployment'
                                    ])
                                )
                            ),
                            _.if(!env.local.menu.hide.collaborators,
                                _.li(
                                    _.a({href: '/repos/' + req.params.user + '/' + req.params.repo + '/collaborators/'}, [
                                        _.span({class: 'glyphicon glyphicon-user'}),
                                        ' Collaborators'
                                    ])
                                )
                            ),
                            _.if(!env.local.menu.hide.issues,
                                _.li(
                                    _.a({href: '/repos/' + req.params.user + '/' + req.params.repo + '/issues/'}, [
                                        _.span({class: 'glyphicon glyphicon-exclamation-sign'}),
                                        ' Issues'
                                    ])
                                )
                            ),
                            _.if(!env.local.menu.hide.settings,
                                _.li(
                                    _.a({href: '/repos/' + req.params.user + '/' + req.params.repo + '/settings/'}, [
                                        _.span({class: 'glyphicon glyphicon-cog'}),
                                        ' Settings'
                                    ])
                                )
                            )
                        ]),
                        _.ul({class: 'nav navbar-nav navbar-right'},
                            _.li({class: 'navbar-btn'},
                                _.div({class: 'input-group'}, [
                                    _.span({class: 'input-group-addon'},
                                        'git'
                                    ),
                                    function() {
                                        var element = _.input({class: 'form-control', type: 'text', value: ''});

                                        element.attr('value', view.repo.cloneUrl); 
                                        
                                        return element;
                                    }
                                ])
                            )
                        )
                    )
                ])
            )
        );

        // Set active navigation button
        $('.navbar-content .navbar-nav li').each(function(i) {
            var a = $(this).children('a');
            var isActive = location.pathname == a.attr('href') || location.pathname + '/' == a.attr('href');

            $(this).toggleClass('active', isActive);
        });
    }
}

new Navbar();
