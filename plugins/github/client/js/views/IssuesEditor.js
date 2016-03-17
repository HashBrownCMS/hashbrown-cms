'use strict';

// Lib
let markdownToHtml = require('marked');
let htmlToMarkdown = require('to-markdown');

class IssuesEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'issues-editor'});

        this.fetch();
    }

    /**
     * Sorts issues and places them in their appropriate parents
     */
    sortIssues() {
        let view = this;
        
        this.$element.find('.issue').each(function(i) {
            let $issue = $(this);

            let milestoneId = $issue.attr('data-milestone');
            let $milestone = view.$element.find('.milestone[data-id="' + milestoneId + '"] .milestone-issues');

            let parentNumber = $issue.attr('data-parent');
            let $parentContainer = view.$element.find('.issue[data-number="' + parentNumber + '"] >.issue-children');
           
            if($milestone.length > 0) {
                $milestone.append($issue);
            }
            
            if($parentContainer.length > 0) {
                $parentContainer.append($issue);
            }
        });
    }

    /**
     * Gets parent issue
     */
    getParentIssue(issue) {
        let pattern = /subtask of #[0-9]+ /;
        let matches = issue.body.toLowerCase().match(pattern);
        let parentNumber = -1;

        if(matches && matches.length > 0) {
            matches = matches[0].match(/[0-9]+/);
            
            parentNumber = parseInt(matches[0]);
        }

        return parentNumber;
    }

    /**
     * Render milestone
     *
     * @param {Object} milestone
     */
    renderMilestone(milestone) {
        let $milestone = _.div({class: 'milestone', 'data-id': milestone.id},
            _.div({class: 'panel'}, [
                _.div({class: 'panel-heading'}, 
                    _.h4({class: 'panel-title'},
                        milestone.title
                    )
                ),
                _.div({class: 'panel-body milestone-issues'})
            ])
        );

        return $milestone;
    }

    render() {
        let view = this;

        this.$element.empty();
        this.$element.append(
            _.each(this.model, function(i, issue) {
                // assignee {String}
                // body {String}
                // closed_at {String}
                // comments {Number}
                // comments_url {String}
                // created_at {String}
                // events_url {String}
                // html_url {String}
                // id {Number}
                // labels {Array}
                // labels_url {String}
                // locked {Boolean}
                // milestone {Object}
                // number {Number}
                // repository_url {String}
                // state {String} open closed
                // title {String}
                // updated_at {String}
                // url {String}
                // user {Object}

                if(issue.milestone && view.$element.find('.milestone[data-id="' + issue.milestone.id + '"]').length < 1) {
                    view.$element.append(view.renderMilestone(issue.milestone));
                }

                let body = issue.body.replace(/Subtask of #[0-9]+/, '');

                let $issue = _.div({
                    class: 'issue',
                    'data-number': issue.number,
                    'data-parent': view.getParentIssue(issue),
                    'data-milestone': issue.milestone ? issue.milestone.id : ''
                }, [
                    _.div({class: 'panel panel-primary'}, [
                        _.div({class: 'panel-heading'},
                            _.h4({class: 'panel-title'},
                                issue.title
                            )
                        ),   
                        _.div({class: 'panel-body'}, 
                            markdownToHtml(body)
                        )
                    ]),
                    _.div({class: 'issue-children'})
                ]);

                return $issue;
            })        
        );

        this.sortIssues();
    }
}

module.exports = IssuesEditor;
