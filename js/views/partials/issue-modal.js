'use strict';

let Issue = require('./issue');

class IssueModal extends View {
    constructor(args) {
        super(args);
        
        let view = this;

        api.labels.fetch(function(labels) {
            view.labels = labels;
        });

        // Register events
        this.on('clickOK', this.onClickOK);
        this.on('changeAssignee', this.onChangeAssignee);
        this.on('changeTitle', this.onChangeTitle);
        this.on('changeBody', this.onChangeBody);
        this.on('changeState', this.onChangeState);
        this.on('changeMilestone', this.onChangeMilestone);

        // Prerender main element
        view.$element = _.div({class: 'modal fade issue-modal', role: 'dialog'},
            _.div({class: 'modal-dialog'},
                _.div({class: 'modal-content'}, [
                    _.div({class: 'modal-header'}, [
                       _.button({type: 'button', class: 'close', 'data-dismiss': 'modal'},
                           _.span({class: 'glyphicon glyphicon-remove'})
                        ),
                        view.$heading = _.span(),
                        _.p({}, [
                            'Created by ',
                            view.$user = _.a()
                        ])
                    ]),
                    _.div({class: 'modal-body'}, [
                        _.div({class: 'row'}, [
                            _.div({class: 'col-xs-6'}, 
                                _.div({class: 'input-group'}, [
                                    _.span({class: 'input-group-addon'},
                                        'Assignee'
                                    ),
                                    function () {
                                        view.$assignee = _.select({class: 'form-control'});

                                        api.collaborators(function(collaborators) {
                                            view.collaborators = collaborators;

                                            view.$assignee.html(
                                                _.each(
                                                    [ { login: '(none)', id: null } ].concat(collaborators),
                                                    function(i, collaborator) {
                                                        return _.option({value: collaborator.id},
                                                            collaborator.login
                                                        );
                                                    }
                                                )
                                            );
                                        });

                                        return view.$assignee;
                                    }().change(view.events.changeAssignee)
                                ])
                            ),
                            _.div({class: 'col-xs-6'}, 
                                _.div({class: 'input-group'}, [
                                    _.span({class: 'input-group-addon'},
                                        'State'
                                    ),
                                    view.$state = _.select({class: 'form-control'},
                                        _.each(
                                            [ 'open', 'closed' ],
                                            function(i, state) {
                                                return _.option({value: state},
                                                    state
                                                );
                                            }
                                        )
                                    ).change(view.events.changeState)
                                ])
                            )
                        ]),         
                        _.div({class: 'input-group'}, [
                            _.span({class: 'input-group-addon'},
                                'Milestone'
                            ),
                            function() {
                                view.$milestone = _.select({class: 'form-control'});
                                    
                                api.milestones(function(milestones) { 
                                    view.milestones = milestones;

                                    view.$milestone.html(
                                        _.option({value: -1}, '(none)')
                                    );

                                    view.$milestone.append(
                                        _.each(
                                            milestones,
                                            function(i, milestone) {
                                                return _.option({value: milestone.number},
                                                    milestone.title
                                                );
                                            }
                                        )
                                    );
                                });

                                return view.$milestone;
                            }().change(view.events.changeMilestone)
                        ]),
                        _.div({class: 'input-group'}, [
                            _.span({class: 'input-group-addon'},
                                'Title'
                            ),
                            view.$title = _.input({type: 'text', class: 'form-control'}).change(view.events.changeTitle)
                        ]),
                        _.div({class: 'input-group input-group-vertical'}, [
                            _.span({class: 'input-group-addon'},
                                'Description'
                            ),
                            view.$body = _.textarea({class: 'form-control'}).change(view.events.changeBody)
                        ])
                    ]),
                    _.div({class: 'modal-footer'}, [
                        view.$labels = _.div({class: 'labels'}),
                        _.button({class: 'btn btn-primary'},
                            'OK'
                        ).click(view.events.clickOK)
                    ])
                ])
            )
        );
    }

    /**
     * Events
     */
    onClickOK(e, element, view) {
        let $issue = $('.issue[data-id="' + view.model.id + '"]');

        if($issue.length > 0) {
            $issue.data('view').sync(view.model);

        } else {
            let issueView = new Issue({
                model: view.model
            });

            let $panel = $('.panel[data-name="backlog"] .sortable');

            $panel.append(issueView.$element);
            ViewHelper.get('Issues').updateIssuePositions();
            
            issueView.sync(view.model);
        
        }
        
        view.hide();
    }

    onChangeAssignee(e, element, view) {
        for(let i in view.collaborators) {
            if(view.collaborators[i].id == $(element).val()) {
                view.model.assignee = view.collaborators[i];
            }
        }
    }
    
    onChangeTitle(e, element, view) {
        view.model.title = $(element).val();
    }
    
    onChangeBody(e, element, view) {
        view.model.body = $(element).val();
    }
    
    onChangeState(e, element, view) {
        view.model.state = $(element).val();
    }
    
    onChangeMilestone(e, element, view) {
        for(let i in view.milestones) {
            if(view.milestones[i].number == $(element).val()) {
                view.model.milestone = view.milestones[i];
            }
        }
    }
   
    hide() {
        this.$element.modal('hide');
    }
    
    show(issue) {
        this.model = issue;
        this.$element.modal('show');
        this.init();
    }

    render() {
        let view = this;

        if(view.model.user) {
            view.$user.html(view.model.user.login);
        } else {
            view.$user.html('me');
        }

        if(view.model.assignee) {
            view.$assignee.val(view.model.assignee.id);
        } else {
            view.$assignee.val('(none)');
        }

        view.$state.val(view.model.state);
        
        if(view.model.milestone) {
            view.$milestone.val(view.model.milestone.number);
        } else {
            view.$milestone.val(-1);
        }

        if(view.model.id) {
            view.$heading.html('Edit issue (id: ' + view.model.id + ')');
        } else {
            view.$heading.html('New issue');
        }

        view.$title.attr('value', view.model.title);

        view.$body.html(view.model.body);

        if(view.model.labels) {
            view.$labels.html(
                _.each(
                    view.model.labels,
                    function(i, label) {
                        function onClickRemove(e) {
                            view.model.labels.splice(i, 1);
                            $label.remove();
                        }

                        let $label = _.div({class: 'label', style: 'background-color: #' + label.color}, [
                            _.span({class: 'label-text'},
                                label.name
                            ),
                            _.button({class: 'btn btn-default label-btn-remove'},
                                _.span({class: 'glyphicon glyphicon-remove'})
                            ).click(onClickRemove)
                        ]);

                        return $label;
                    }
                )
            );
        } else {
            view.$labels.empty();
        }

        view.$labels.append(
           _.div({class: 'dropdown'}, [
                _.button({class: 'btn btn-default dropdown-toggle', type: 'button', 'data-toggle': 'dropdown'},
                   _.span({class: 'glyphicon glyphicon-plus'})
                ),
                _.ul({class: 'dropdown-menu'},
                    _.each(view.labels,
                        function(i, label) {
                            function onClick(e) {
                                e.preventDefault();

                                view.model.labels.push(label);
                                view.render();
                            }

                            return _.li({style: 'background-color: #' + label.color},
                                _.a({href: '#'},
                                    label.name
                                ).click(onClick) 
                            );
                        }
                    )
                )
            ])
        );
    }
}

module.exports = IssueModal;
