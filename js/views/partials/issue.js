module.exports = View.extend(function(params) {
    var self = this;

    self.adopt(params);
    self.register();

    self.fetch();
},
{
    render: function() {
        var self = this;

        self.$element = _.div({class: 'panel panel-primary'}, [
            _.div({class: 'panel-heading'},
                _.h4(self.model.title)
            ),
            _.div({class: 'panel-body'},
                _.p(self.model.body)
            )
        ]);
    }
});
