'use strict';

// Lib
let markdownToHtml = require('marked');

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
            let $milestone = view.$element.find('.milestone[data-id="' + milestoneId + '"]');

            let parentNumber = $issue.attr('data-parent');
            let $parentIssue = view.$element.find('.issue[data-number="' + parentNumber + '"]');
           
            if($milestone.length > 0) {
                $milestone.find('.milestone-issues').append($issue);

                $milestone.children('.panel').children('.panel-footer').children('a').children('.issue-count').html($milestone.find('.issue').length);
            }
            
            if($parentIssue.length > 0) {
                let $panel = $parentIssue.children('.panel');
                
                if($panel.find('.panel-footer').length < 1) {
                    $panel.append(
                        _.div({class: 'panel-footer'}, [
                            _.a({'data-toggle': 'collapse', href: '#collapse-' + parentNumber}, [
                                _.span({class: 'issue-count'}),
                                _.span({class: 'fa fa-chevron-up'}),    
                                _.span({class: 'fa fa-chevron-down'})    
                            ]),
                            _.div({id: 'collapse-' + parentNumber, class: 'collapse issue-children'})
                        ])
                    );
                }
              
                $panel.children('.panel-footer').children('.issue-children').append($issue);

                $panel.children('.panel-footer').children('a').children('.issue-count').html($panel.find('.issue').length);
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
        console.log(milestone);

        let $milestone = _.div({class: 'milestone', 'data-id': milestone.id},
            _.div({class: 'panel panel-default'}, [
                _.div({class: 'panel-heading'}, 
                    _.h4({class: 'panel-title'},
                        milestone.title
                    )
                ),
                _.div({class: 'panel-body'},
                   milestone.description 
                ),
                _.div({class: 'panel-footer'}, [
                    _.a({'data-toggle': 'collapse', href: '#collapse-' + milestone.id, 'aria-expanded': true}, [
                        _.span({class: 'issue-count'}),
                        _.span({class: 'fa fa-chevron-up'}),    
                        _.span({class: 'fa fa-chevron-down'})    
                    ]),
                    _.div({id: 'collapse-' + milestone.id, class: 'collapse in milestone-issues'})
                ])
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
                    _.div({class: 'panel panel-default'}, [
                        _.div({class: 'panel-heading'},
                            _.h4({class: 'panel-title'},
                                issue.title
                            )
                        ),
                        _.div({class: 'panel-body issue-body'},
                            markdownToHtml(body)
                        )
                    ])
                ]);

                return $issue;
            })        
        );

        this.sortIssues();
    }
}

module.exports = IssuesEditor;
