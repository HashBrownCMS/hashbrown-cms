require('../client');
require('./partials/navbar');

$('.page-content').html(
    _.div({class: 'container'}, [
        _.div({class: 'panel panel-primary'}, [
            _.div({class: 'panel-heading'}, [
                _.p({class: 'pull-right'},
                    'updated 2015-11-05 13:04:15'
                ),
                _.h4({class: 'panel-title'},
                    'stage'
                )
            ]),
            _.div({class: 'panel-body'},
                _.div({class: 'row'}, [
                    _.div({class: 'col-md-6'},
                        _.div({class: 'panel panel-default'}, [
                            _.div({class: 'panel-heading'},
                                _.h4({class: 'panel-title'},
                                    'Git log'
                                )
                            ),
                            _.div({class: 'panel-body'},
                                'Blah'
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
        _.div({class: 'btn-group repo-actions'}, [
            _.button({class: 'btn btn-primary'},
                _.span({class: 'glyphicon glyphicon-arrow-down'})
            ),
            _.button({class: 'btn btn-primary'},
                _.span({class: 'glyphicon glyphicon-arrow-up'})
            )
        ]),
        _.div({class: 'panel panel-primary'}, [
            _.div({class: 'panel-heading'}, [
                _.p({class: 'pull-right'},
                    'updated 2015-11-05 13:04:15'
                ),
                _.h4({class: 'panel-title'},
                    'live'
                )
            ]),
            _.div({class: 'panel-body'},
                _.div({class: 'row'}, [
                    _.div({class: 'col-md-6'},
                        _.div({class: 'panel panel-default'}, [
                            _.div({class: 'panel-heading'},
                                _.h4({class: 'panel-title'},
                                    'Git log'
                                )
                            ),
                            _.div({class: 'panel-body'},
                                'Blah'
                            )
                        ])
                    ),
                    _.div({class: 'col-md-6'},
                        _.div({class: 'btn-group'}, [
                            _.a({class: 'btn btn-default', href: '/repos/' + req.params.repo + '/live/cms/'},
                                'Go to CMS'
                            ),
                            _.a({class: 'btn btn-default', href: '/repos/' + req.params.repo + '/live/'},
                                'Go to website'
                            )
                        ])
                    )
                ])
            )
        ])
    ])        
);
