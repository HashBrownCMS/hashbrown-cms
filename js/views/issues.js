require('../client');
require('./partials/navbar');

var Issue = require('./partials/issue');
var IssueModal = require('./partials/issue-modal');

function onChangeMilestone() {
    var id = $('.milestones').val();

    _.each(View.getAll('Issue'),
        function(i, view) {
            view.$element.toggle(id == 'all' || view.model.milestone.id == id);
        }
    );
}

function onMoveIssueColumn($issue) {
    $issue.data('view').updateColumnFromPosition();
}

function onClickNewIssue() {
    var newIssue = {
        title: 'Issue title',
        body: 'Issue description',
        state: 'open'
    };

    View.get('IssueModal').show(newIssue);
}

function updateIssuePositions() {
    _.each(View.getAll('Issue'),
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
        onMoveIssueColumn(ui.item);
    });
}

api.issueColumns(function(columns) {
    api.issues(function(issues) {
        api.milestones(function(milestones) {
            $('.page-content').html([
                _.div({class: 'container'}, [
                    // Render all issues outside the columns first
                    _.each(
                        issues,
                        function(i, issue) {
                            return new Issue({
                                model: issue
                            }).$element;
                        }
                    ),
                    // Issue actions
                    _.div({class: 'btn-group issue-actions'},
                        _.button({class: 'btn btn-primary'}, [
                            _.span({class: 'glyphicon glyphicon-plus'}),
                            ' New issue'
                        ]).click(onClickNewIssue)
                    ),
                    // Milestone picker
                    _.div({class: 'input-group p-b-md'}, [
                        _.span({class: 'input-group-addon'},
                            'Milestone'
                        ),
                        _.select({class: 'form-control milestones'},
                            _.each([ { id: 'all', title: '(all issues)' } ].concat(milestones),
                                function(i, milestone) {
                                    return _.option({value: milestone.id},
                                        milestone.title
                                    );
                                }
                            )
                        ).change(onChangeMilestone)
                    ]),
                    // Columns
                    _.div({class: 'row'},
                        _.each(
                            columns,
                            function(c, column) {
                                var colSize = 12 / columns.length;

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

            updateIssuePositions();
        });
    });
});
