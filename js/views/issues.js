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
    $issue.data('view').scrapeColumn();
}

function updateIssuePositions() {
    var milestoneId = $('.milestones').val();

    _.each(View.getAll('Issue'),
        function(i, view) {
            var issue = view.model

            view.$element.toggle(id == 'all' || issue.milestone.id == milestoneId);

            var column = 'backlog';

            if(issue.state == 'closed') {
                column = 'done';
            
            } else {
                for(var l in issue.labels) {
                    column = issue.labels[l].name;
                    // TODO: FIX!
                }
            
            }

            $('.column[data-name="' + column + '"]').each(function(c) {
        }
    );
}

api.issueColumns(function(columns) {
    api.issues(function(issues) {
        api.milestones(function(milestones) {
            $('.page-content').html([
                _.div({class: 'container'}, [
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
                    _.div({class: 'row'},
                        _.each(
                            columns,
                            function(c, column) {
                                var colSize = 12 / columns.length;

                                return _.div({class: 'col-xs-' + colSize},
                                    _.div({class: 'panel panel-default column', 'data-name': column.name}, [
                                        _.div({class: 'panel-heading'},
                                            _.span(column)
                                        ),
                                        _.div({class: 'panel-body sortable'},
                                            _.each(
                                                issues.filter(function(issue) {
                                                    var closed = issue.state == 'closed' && column == 'done';
                                                    var backlog = issue.state == 'open' && column == 'backlog';
                                                    
                                                    if(closed) {
                                                        return true;
                                                    }

                                                    for(var l in issue.labels) {
                                                        var hasLabel = issue.labels[l].name == column;
                                                        
                                                        if(hasLabel) {
                                                            return true;
                                                        }
                                                    }
                                                    
                                                    if(backlog) {
                                                        return true;
                                                    }

                                                    return false;
                                                }),
                                                function(i, issue) {
                                                    return new Issue({
                                                        model: issue
                                                    }).$element;
                                                }
                                            )
                                        )
                                    ])
                                );                  
                            }
                        )
                    )
                ]),
                new IssueModal().$element
            ]);

            $('.sortable').sortable({
                forcePlaceholderSize: true,
                connectWith: '.sortable',
            }).bind('sortupdate', function(e, ui) {
                onMoveIssueColumn(ui.item);
            });
        });
    });
});
