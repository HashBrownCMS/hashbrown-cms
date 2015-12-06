module.exports = View.extend(function Issue(params) {
    var self = this;

    self.adopt(params);
    self.register();
    
    // Init html
    self.$element = _.div({class: 'panel panel-primary issue'}).click(onClick);

    self.fetch();
    
    // Private methods
    function onClick() {
        View.get('IssueModal').show(self.model);
    }
    
    // Public methods
    self.scrapeColumn = function scrapeColumn() {
        console.log('yippie!');
    };
    
    self.sync = function sync(model) {
        self.model = model;

        console.log(self.model);
        
        // TODO: Syncing logic
        
        self.render();
    };
},
{
    render: function() {
        var self = this;

        self.$element.attr('id', self.model.id);
        self.$element.html([
            _.div({class: 'panel-heading'}, [
                _.span(self.model.title),
                function() {
                    if(self.model.assignee) {
                        return _.img({alt: '', src: self.model.assignee.avatarUrl});
                    }
                }
            ]),
            _.div({class: 'panel-body'},
                _.span(self.model.body)
            )
        ]);
    }
});
