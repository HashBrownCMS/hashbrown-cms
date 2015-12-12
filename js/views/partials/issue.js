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
    self.updateMilestonePosition = function updateMilestonePosition() {
        var milestoneId = $('.milestones').val();

        self.$element.toggle(milestoneId == 'all' || self.model.milestone.id == milestoneId);
    };

    self.updateColumnFromPosition = function updateColumnFromPosition() {
        var $column = self.$element.parents('.column');

        self.model.state = $column.data('name') == 'done' ? 'closed' : 'open';

        // Update model labels
    };

    self.updateColumnPosition = function updateColumnPosition() {
        var column = 'backlog';

        if(self.model.state == 'closed') {
            column = 'done';
        
        } else {
            for(var l in self.model.labels) {
                var name = self.model.labels[l].name;
                
                if($('.column[data-name="' + name + '"]').length > 0) {
                    column = name;
                }
            }
        
        }

        $('.column[data-name="' + column + '"] .sortable').append(self.$element);
    };
    
    self.sync = function sync(model) {
        self.model = model;

        console.log(self.model);
        
        // TODO: Syncing logic
        
        self.render();
        
        self.updateColumnPosition();
        self.updateMilestonePosition();
    };
},
{
    render: function() {
        var self = this;

        console.log(JSON.stringify(self.model));

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
