require('../client');
require('./partials/navbar');

function compareBranches(base, head) {
    api.compare(req.params.user, req.params.repo, base, head, function(compare) {
        $h4 = $('#' + base).children('.panel-heading').children('h4');
        
        if(compare.aheadBy > 0) {
            $h4.append(
                ' (ahead of ' + head + ' by ' + compare.aheadBy + ' commits)'
            );
        
        } else if(compare.behindBy > 0) {
            $h4.append(
                ' (behind ' + head + ' by ' + compare.behindBy + ' commits)'
            );

        } else {
            $h4.append(
                ' (in sync with ' + head + ')'
            );

        }
    });
}

function render() {
    api.branches(req.params.user, req.params.repo, function(branches) {
        $('.page-content').html(
            _.div({class: 'container'},
                _.each(
                    branches,
                    function(i, branch) {
                        i = parseInt(i);

                        function onClickMergeUp(e) {
                            var $container = $(this).parents('.repo-actions');   

                            $container.find('.progress').toggleClass('hidden', false);
                            $container.find('.btn-group').toggleClass('hidden', true);

                            api.merge(req.params.user, req.params.repo, branches[i].name, branches[i+1].name, function(merge) {
                                console.log(merge);
                                render();
                            });
                        }

                        function onClickMergeDown(e) {
                            var $container = $(this).parents('.repo-actions');   
                            
                            $container.find('.progress').toggleClass('hidden', false);
                            $container.find('.btn-group').toggleClass('hidden', true);
                            
                            api.merge(req.params.user, req.params.repo, branches[i+1].name, branches[i].name, function(merge) {
                                console.log(merge);
                                render();
                            });
                        }

                        var $branch = _.div({class: 'panel panel-primary branch', id: branch.name}, [
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
                                            _.a({class: 'btn btn-default', href: '/repos/' + req.params.user + '/' + req.params.repo + '/' + branch.name + '/cms/'},
                                                'Go to CMS'
                                            ),
                                            _.a({class: 'btn btn-default', href: '/redir/website/' + req.params.repo + '/' + branch.name},
                                                'Go to website'
                                           ),
                                            _.a({class: 'btn btn-default', href: branch.Links.html},
                                                'Go to repo'
                                           )
                                        ])
                                    )
                                ])
                            )
                        ]);

                        var $actions = _.div({class: 'repo-actions'}, [
                            _.div({class: 'progress hidden'},
                                _.div({class: 'progress-bar progress-bar-striped active', role: 'progressbar', 'aria-valuenow': 100, 'aria-valuemax': 100, style: 'width:100%'})
                            ),
                            _.div({class: 'btn-group'}, [
                                _.button({class: 'btn btn-lg btn-primary'},
                                    _.span({class: 'glyphicon glyphicon-download'})
                                ).click(onClickMergeDown),
                                _.button({class: 'btn btn-lg btn-primary'},
                                    _.span({class: 'glyphicon glyphicon-upload'})
                                ).click(onClickMergeUp)
                            ])
                        ]);


                        return [
                            $branch,
                            i < branches.length - 1 ? $actions : null
                        ];
                    }
                )
            )
        );

        for(var b = 1; b < branches.length; b++) {
            var base = branches[b];
            var head = branches[b-1];

            compareBranches(base.name, head.name);
        } 
    });
}

render();
