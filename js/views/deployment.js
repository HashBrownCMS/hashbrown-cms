require('../client');
require('./partials/navbar');

api.branches(req.params.user, req.params.repo, function(branches) {
    $('.page-content').html(
        _.div({class: 'container'},
            _.each(
                branches,
                function(i, branch) {
                    i = parseInt(i);

                    function onClickMergeUp() {
                        api.merge(req.params.user, req.params.repo, branches[i].name, branches[i+1].name, function(merge) {
                            console.log(merge);
                        });
                    }

                    function onClickMergeDown() {
                        api.merge(req.params.user, req.params.repo, branches[i+1].name, branches[i].name, function(merge) {
                            console.log(merge);
                        });
                    }

                    return [
                        _.div({class: 'panel panel-primary'}, [
                            _.div({class: 'panel-heading'}, 
                                _.h4({class: 'panel-title text-center'},
                                    branch.name
                                )
                            ),
                            _.div({class: 'panel-body'},
                                _.div({class: 'row'}, [
                                    _.div({class: 'col-md-6'},
                                        _.div({class: 'panel panel-default'}, [
                                            _.div({class: 'panel-heading'},
                                                _.h4({class: 'panel-title'},
                                                    'updated at ' + helper.formatDate(branch.updated.date) + ' by <a href="mailto:' + branch.updated.email + '">' + branch.updated.name + '</a>'
                                                )
                                            ),
                                            _.div({class: 'panel-body'},
                                                branch.updated.message
                                            )
                                        ])
                                    ),
                                    _.div({class: 'col-md-6'},
                                        _.div({class: 'btn-group'}, [
                                            _.a({class: 'btn btn-default', href: '/repos/' + req.params.repo + '/stage/cms/'},
                                                'Go to CMS'
                                            ),
                                            _.a({class: 'btn btn-default', href: '/repos/' + req.params.repo + '/stage/'},
                                                'Go to website'
                                           )
                                        ])
                                    )
                                ])
                            )
                        ]),
                        i < branches.length - 1 ? _.div({class: 'btn-group repo-actions'}, [
                            _.button({class: 'btn btn-primary'},
                                _.span({class: 'glyphicon glyphicon-arrow-down'})
                            ).click(onClickMergeDown),
                            _.button({class: 'btn btn-primary'},
                                _.span({class: 'glyphicon glyphicon-arrow-up'})
                            ).click(onClickMergeUp)
                        ]) : null
                    ];
                }
            )
        )
    ); 
});
