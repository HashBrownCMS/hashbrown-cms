require('../client');
require('./partials/navbar');

class Deployment extends View {
    constructor(args) {
        super(args);

        this.modelFunction = api.branches.get;

        this.fetch();
    }

    compareBranches(base, head) {
        api.compare(base, head, function(compare) {
            let $h4 = $('#' + base).children('.panel-heading').children('h4');
            
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

    render() {
        let view = this;

        $('.page-content').html(
            _.div({class: 'container'},
                _.each(
                    this.model,
                    function(i, branch) {
                        i = parseInt(i);

                        function onClickMergeUp(e) {
                            let $container = $(this).parents('.repo-actions');   

                            $container.find('.progress').toggleClass('hidden', false);
                            $container.find('.btn-group').toggleClass('hidden', true);

                            api.merge(req.params.user, req.params.repo, view.model[i].name, view.model[i+1].name, function(merge) {
                                console.log(merge);
                                render();
                            });
                        }

                        function onClickMergeDown(e) {
                            let $container = $(this).parents('.repo-actions');   
                            
                            $container.find('.progress').toggleClass('hidden', false);
                            $container.find('.btn-group').toggleClass('hidden', true);
                            
                            api.merge(req.params.user, req.params.repo, view.model[i+1].name, view.model[i].name, function(merge) {
                                console.log(merge);
                                render();
                            });
                        }

                        let $branch = _.div({class: 'panel panel-primary branch', id: branch.name}, [
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

                        let $actions = _.div({class: 'repo-actions'}, [
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
                            i < view.model.length - 1 ? $actions : null
                        ];
                    }
                )
            )
        );

        for(let b = 1; b < this.model.length; b++) {
            let base = this.model[b];
            let head = this.model[b-1];

            view.compareBranches(base.name, head.name);
        } 
    }
}

new Deployment();
