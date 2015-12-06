module.exports = View.extend(function IssueModal(params) {
    var self = this;

    self.adopt(params);
    self.register();

    function onClickOK() {
        $('#' + self.model.id).data('view').sync(self.model);
        self.hide();
    }

    function onChangeAssignee() {
        for(var i in self.collaborators) {
            if(self.collaborators[i].id == $(this).val()) {
                self.model.assignee = self.collaborators[i];
            }
        }
    }
    
    function onChangeTitle() {
        self.model.title = $(this).val();
    }
    
    function onChangeBody() {
        self.model.body = $(this).val();
    }
    
    function onChangeState() {
        self.model.state = $(this).val();
    }
    
    function onChangeMilestone() {
        for(var i in self.milestones) {
            if(self.milestones[i].id == $(this).val()) {
                self.model.milestone = self.milestones[i];
            }
        }
    }

    self.$element = _.div({class: 'modal fade issue-modal', role: 'dialog'},
        _.div({class: 'modal-dialog'},
            _.div({class: 'modal-content'}, [
                _.div({class: 'modal-header'}, [
                   _.button({type: 'button', class: 'close', 'data-dismiss': 'modal'},
                       _.span({class: 'glyphicon glyphicon-remove'})
                    ),
                   self.$heading = _.span()
                ]),
                _.div({class: 'modal-body'}, [
                    _.div({class: 'input-group'}, [
                        _.span({class: 'input-group-addon'},
                            'Created by'
                        ),
                        self.$user = _.span({class: 'form-control form-control-static'})
                    ]),
                    _.div({class: 'input-group'}, [
                        _.span({class: 'input-group-addon'},
                            'Assignee'
                        ),
                        function () {
                            self.$assignee = _.select({class: 'form-control'});

                            api.collaborators(function(collaborators) {
                                self.collaborators = collaborators;

                                self.$assignee.html(
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

                            return self.$assignee;
                        }().change(onChangeAssignee)
                    ]),
                    _.div({class: 'input-group'}, [
                        _.span({class: 'input-group-addon'},
                            'State'
                        ),
                        self.$state = _.select({class: 'form-control'},
                            _.each(
                                [ 'open', 'closed' ],
                                function(i, state) {
                                    return _.option({value: state},
                                        state
                                    );
                                }
                            )
                        ).change(onChangeState)
                    ]),
                    _.div({class: 'input-group'}, [
                        _.span({class: 'input-group-addon'},
                            'Milestone'
                        ),
                        function() {
                            self.$milestone = _.select({class: 'form-control'});
                                
                            api.milestones(function(milestones) { 
                                self.milestones = milestones;

                                self.$milestone.html(
                                    _.each(
                                        milestones,
                                        function(i, milestone) {
                                            return _.option({value: milestone.id},
                                                milestone.title
                                            );
                                        }
                                    )
                                );
                            });

                            return self.$milestone;
                        }().change(onChangeMilestone)
                    ]),
                    _.div({class: 'input-group'}, [
                        _.span({class: 'input-group-addon'},
                            'Title'
                        ),
                        self.$title = _.input({type: 'text', class: 'form-control'}).change(onChangeTitle)
                    ]),
                    _.div({class: 'input-group input-group-vertical'}, [
                        _.span({class: 'input-group-addon'},
                            'Description'
                        ),
                        self.$body = _.textarea({class: 'form-control'}).change(onChangeBody)
                    ])
                ]),
                _.div({class: 'modal-footer'}, [
                    self.$labels = _.div({class: 'labels'}),
                    _.button({class: 'btn btn-primary'},
                        'OK'
                    ).click(onClickOK)
                ])
            ])
        )
    );
    
    self.hide = function show(issue) {
        self.$element.modal('hide');
    };
    
    self.show = function show(issue) {
        self.model = issue;
        self.render();
        self.$element.modal('show');
    };
},
{
    render: function() {
        var self = this;
       
        console.log(self.model);

        self.$user.html(self.model.user.login);

        if(self.model.assignee) {
            self.$assignee.val(self.model.assignee.login);
        }

        self.$state.val(self.model.state);
        
        self.$milestone.val(self.model.milestone.id);

        self.$heading.html('Edit issue (id: ' + self.model.id + ')');

        self.$title.attr('value', self.model.title);

        self.$body.html(self.model.body);

        self.$labels.html(
            _.each(
                self.model.labels,
                function(i, label) {
                    function onClickRemove(e) {
                        self.model.labels.splice(i, 1);
                        $label.remove();
                    }

                    var $label = _.div({class: 'label', style: 'background-color: #' + label.color}, [
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
    }
});
