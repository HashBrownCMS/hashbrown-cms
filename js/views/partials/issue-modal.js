module.exports = View.extend(function IssueModal(params) {
    var self = this;

    self.adopt(params);
    self.register();

    self.$element = _.div({class: 'modal fade issue-modal', role: 'dialog'},
        _.div({class: 'modal-dialog'},
            _.div({class: 'modal-content'}, [
                _.div({class: 'modal-header'},
                   _.button({type: 'button', class: 'close', 'data-dismiss': 'modal'},
                       _.span({class: 'glyphicon glyphicon-remove'}),
                        self.$title = _.h4({class: 'modal-title'})
                    )
                ),
                _.div({class: 'modal-body'},
                    self.$description = _.p()
                ),
                _.div({class: 'modal-footer'},
                    self.$labels = _.div({class: 'labels'})
                )
            ])
        )
    );
    
    self.show = function show(issue) {
        self.model = issue;
        self.render();
        self.$element.modal('show');
    };
},
{
    render: function() {
        var self = this;
       
        self.$title.html(self.model.title);

        self.$description.html(self.model.description);

        self.$labels.html(
            _.each(
                self.model.labels,
                function(i, label) {
                    function onClickRemove() {

                    }

                    return _.div({class: 'label'}, [
                        _.span({class: 'label-text', style: 'background-color: #' + label.color},
                            label.name
                        ),
                        _.button({class: 'btn btn-default label-btn-remove'},
                            _.span({class: 'glyphicon glyphicon-remove'})
                        )
                    ]);
                }
            )
        );
    }
});
