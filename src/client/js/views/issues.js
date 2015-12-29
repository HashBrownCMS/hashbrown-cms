require('../client');
require('./partials/navbar');

var Issue = require('./partials/issue');
let IssueModal = require('./partials/issue-modal');

class Issues extends View {
    constructor(args) {
        super(args);

        let view = this;

        api.issueColumns(function(columns) {
            api.issues.fetch(function(issues) {
                api.milestones.fetch(function(milestones) {
                    view.columns = columns;
                    view.issues = issues;
                    view.milestones = milestones;

                    view.render();
                });
            });
        });
    }

    /**
     * Actions
     */
    updateIssuePositions() {
        let view = this;

        _.each(ViewHelper.getAll('Issue'),
            function(i, view) {
                view.updateMilestonePosition();
                view.updateColumnPosition();
            }
        );
        
        $('.sortable').sortable('destroy');
        $('.sortable').sortable({
            forcePlaceholderSize: true,
            connectWith: '.sortable',
        }).bind('sortupdate', function(e, ui) {
            view.onMoveIssueColumn(ui.item);
        });
    }
    

    /**
     * Events
     */
    onMoveIssueColumn($issue) {
        var view = $issue.data('view');
        
        view.updateColumnFromPosition();
    }

    onChangeMilestone() {
        let id = $('.milestones').val();

        _.each(ViewHelper.getAll('Issue'),
            function(i, view) {
                view.$element.toggle(id == 'all' || (view.model.milestone && view.model.milestone.id == id));
            }
        );
    }

    onClickNewIssue() {
        let newIssue = {
            title: 'Issue title',
            body: 'Issue description',
            state: 'open'
        };

        ViewHelper.get('IssueModal').show(newIssue);
    }

    render() {
        let view = this;

        $('.page-content').html([
            _.div({class: 'container'}, [
                // Render all issues outside the columns first
                _.each(
                    view.issues,
                    function(i, issue) {
                        return new Issue({
                            model: issue
                        }).$element;
                    }
                ),
                // Issue actions
                _.div({class: 'btn-group p-b-sm'},
                    _.button({class: 'btn btn-primary'}, [
                        _.span({class: 'glyphicon glyphicon-plus'}),
                        ' New issue'
                    ]).click(view.onClickNewIssue)
                ),
                // Milestone picker
                _.div({class: 'input-group p-b-sm'}, [
                    _.span({class: 'input-group-addon'},
                        'Milestone'
                    ),
                    _.select({class: 'form-control milestones'},
                        _.each([ { id: 'all', title: '(all issues)' } ].concat(view.milestones),
                            function(i, milestone) {
                                return _.option({value: milestone.id},
                                    milestone.title
                                );
                            }
                        )
                    ).change(view.onChangeMilestone)
                ]),
                // Columns
                _.div({class: 'row'},
                    _.each(
                        view.columns,
                        function(c, column) {
                            var colSize = 12 / view.columns.length;

                            return _.div({class: 'col-xs-' + colSize},
                                _.div({class: 'panel panel-default column', 'data-name': column}, [
                                    _.div({class: 'panel-heading'},
                                        _.span(column)
                                    ),
                                    _.div({class: 'panel-body sortable'})
                                ])
                            );                  
                        }
                    )
                )
            ]),
            new IssueModal().$element
        ]);

        // Put the issues into their appropriate columns
        view.updateIssuePositions();
    } 
}

new Issues();
