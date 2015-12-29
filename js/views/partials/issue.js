'use strict';

class Issue extends View {
    constructor(args) {
        super(args);

        // Register events
        this.on('click', this.onClick);
        
        // Init html
        this.$element = _.div({class: 'panel panel-primary issue'}).click(this.events.click);

        this.init();
    }

    /**
     * Events
     */
    onClick(e, element, view) {
        ViewHelper.get('IssueModal').show(view.model);
    }
    
    /**
     * Sorting actions
     */
    updateMilestonePosition() {
        let milestoneId = $('.milestones').val();

        this.$element.toggle(milestoneId == 'all' || this.model.milestone.id == milestoneId);
    }

    updateColumnFromPosition() {
        let $column = this.$element.parents('.column');
        let columnName = $column.data('name');

        this.model.state = columnName == 'done' ? 'closed' : 'open';

        // Remove column labels
        for(let i = this.model.labels.length - 1; i >= 0; i--) {
            let label = this.model.labels[i];

            if($('.column[data-name="' + label.name + '"]').length > 0) {
                this.model.labels.splice(i, 1);
            }
        }
        
        // Add new column label
        this.model.labels.push({ name: columnName });

        // Sync
        this.sync();
    }

    updateColumnPosition() {
        let column = 'backlog';

        if(this.model.state == 'closed') {
            column = 'done';
        
        } else {
            for(let l in this.model.labels) {
                let name = this.model.labels[l].name;
                
                if($('.column[data-name="' + name + '"]').length > 0) {
                    column = name;
                }
            }
        
        }

        $('.column[data-name="' + column + '"] .sortable').append(this.$element);
    }
    
    /**
     * Updating
     */
    update() {
        this.init();
        
        this.updateColumnPosition();
        this.updateMilestonePosition();
    }

    setLoading(active) {
        this.$element.toggleClass('loading', active);
    }

    sync() {
        let view = this;

        // Activate loading state
        view.$element.toggleClass('loading', true);

        // This is a new issue
        if(!view.model.id) {
            api.issues.create({ data: view.model }, function(issue) {
                view.model = issue;
               
                view.update();
                view.$element.toggleClass('loading', false);
            });

        // This is an existing issue
        } else {
            api.issues.update({data: view.model}, function(issue) {
                view.model = issue;
                
                view.update();
                view.$element.toggleClass('loading', false);
            });

        }    
    }
    
    /**
     * Rendering
     */
    render() {
        let view = this;

        this.$element.attr('data-id', view.model.id);
        this.$element.html([
            _.div({class: 'panel-heading'}, [
                _.span(view.model.title),
                function() {
                    if(view.model.assignee) {
                        return _.img({alt: '', src: view.model.assignee.avatarUrl});
                    }
                }
            ]),
            _.div({class: 'panel-body'},
                _.span(view.model.body)
            ),
            _.div({class: 'panel-spinner'},
                _.div({class: 'spinner'})
            )
        ]);
    }
}

module.exports = Issue;
