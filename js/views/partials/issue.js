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

        this.model.state = $column.data('name') == 'done' ? 'closed' : 'open';

        // Update model labels
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

    sync(model) {
        let view = this;

        view.model = model;

        // This is a new issue
        if(!view.model.id) {
            api.issues.create(view.model, function(issue) {
                view.model = issue;
                
                view.update();
            });

        // This is an existing issue
        } else {
            api.issues.update(view.model, function(issue) {
                view.model = issue;
                
                view.update();
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
