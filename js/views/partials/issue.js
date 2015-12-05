module.exports = View.extend(function(params) {
    var self = this;

    self.adopt(params);
    self.register();

    self.fetch();
},
{
    render: function() {
        var self = this;

        self.$element = _.div({class: 'panel panel-primary issue'}, [
            _.div({class: 'panel-heading'},
                _.h4(self.model.title)
            ),
            _.div({class: 'panel-body'}, [
                _.p(self.model.body),
                _.div({class: 'labels'},
                    _.each(
                        self.model.labels,
                        function(i, label) {
                            function onClickRemove() {

                            }

                            return _.div({class: 'input-group'},[
                                _.label({style: 'background-color: #' + label.color},
                                    label.name
                                ),
                                _.button({class: 'input-group-btn'},
                                    _.span({class: 'glyphicon glyphicon-remove'})
                                )
                            ]);
                        }
                    )
                )
            ])
        ]);
    }
});
