module.exports = View.extend(function Issue(params) {
    var self = this;

    self.adopt(params);
    self.register();

    self.fetch();
},
{
    render: function() {
        var self = this;

        function onClick() {
            View.get('IssueModal').show(self.model);
        }

        self.$element = _.div({class: 'panel panel-primary issue'}, [
            _.div({class: 'panel-heading'},
                _.h4(self.model.title)
            ),
            _.div({class: 'panel-body'},
                _.p(self.model.body)
            )
        ]).click(onClick);
    }
});
