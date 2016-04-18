'use strict';

let config = require('../../config.json');

// Lib
let markdownToHtml = require('marked');

class BoardEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'board-editor'});

        this.fetch();
    }

    /**
     * Sorts issues and places them in their appropriate parents
     */
    sortIssues() {
        let view = this;
        
        this.$element.find('.issue').each(function(i) {
            let $issue = $(this);
            let issue = $issue.data('model');
            let labels = issue.labels;

            let $column;

            // Look for columns matches any issue label
            if(labels) {
                for(let label of labels) {
                    let $foundColumn = view.$element.find('.column[data-name="' + label.name + '"]');

                    if($foundColumn.length > 0) {
                        $column = $foundColumn;
                        break;
                    }
                }
            }

            // If no matching column was found, put in either 'backlog' or 'closed' column
            if(!$column) {
                if(issue.state == 'closed') {
                    $column = view.$element.find('.column[data-name="closed"]');
                } else {
                    $column = view.$element.find('.column[data-name="backlog"]');
                }
            }

            $column.find('.column-issues').append($issue);   
        });
    }

    /**
     * Renders a column
     */
    renderColumn(name) {
        let $column = _.div({class: 'column', 'data-name': name},
            _.div({class: 'panel panel-default'}, [
                _.div({class: 'panel-heading'},
                    _.h4({class: 'panel-title'}, name)
                ),
                _.div({class: 'panel-body column-issues'})
            ])
        );

        return $column;
    }

    /**
     * Renders an issue
     */
    renderIssue(issue) {
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

        let $issue = _.div({
            class: 'issue',
            'data-id': issue.id,
            'data-number': issue.number,
            'data-milestone': issue.milestone ? issue.milestone.id : '',
        },
            _.div({class: 'panel panel-default'},
                _.div({class: 'panel-heading'},
                    _.h4({class: 'panel-title'},
                        issue.title
                    )
                ),
                _.div({class: 'panel-body issue-body'},
                    markdownToHtml(issue.body)
                )
            ),
            _.div({class: 'spinner'},
                _.span({class: 'fa fa-refresh'})
            )
        );

        $issue.data('model', issue);

        return $issue;
    }

    /**
     * Removes column labels from an issue
     *
     * @param {Object} issue
     */
    removeColumnLabels(issue) {
        for(let columnName of config.board.columns) {
            for(let i in issue.labels) {
                let label = issue.labels[i];

                if(label == columnName) {
                    issue.labels.splice(i, 1);    
                }
            }
        }
    }

    /**
     * Updates an issue
     *
     * @param {Object} issue
     */
    updateIssueFromElement($issue) {
        let issue = $issue.data('model');
        let $column = $issue.parents('.column');
        let columnName = $column.data('name');
       
        $issue.toggleClass('spinner-container', true);

        switch(columnName) {
            case 'closed':
                issue.state = 'closed';
                this.removeColumnLabels(issue);
                break;

            case 'backlog':
                issue.state = 'open';
                this.removeColumnLabels(issue);
                break;

            default:
                this.removeColumnLabels(issue);
                issue.labels[issue.labels.length] = columnName;
                break;
        }

        console.log('TODO: Sync with GitHub backend');

        setTimeout(function() {
            $issue.toggleClass('spinner-container', false);
        }, 1000);
    }
    

    /**
     * Applies html5sortable plugin
     */
    applySortable() {
        let view = this;

        $('.board-editor .column-issues').sortable('destroy');

        $('.board-editor .column-issues').sortable({
            items: '.issue',
            forcePlaceholderSize: true,
            connectWith: '.board-editor .column-issues'
        }).on('sortstop', function(e, ui) {
            let $issue = ui.item;

            view.updateIssueFromElement($issue);
        });
    }

    render() {
        let view = this;

        this.$element.empty();
        this.$element.append(
            _.each(this.model, function(i, issue) {
                return view.renderIssue(issue);
            })        
        );

        this.$element.append(this.renderColumn('backlog'));
    
        for(let columnName of config.board.columns) {
            this.$element.append(this.renderColumn(columnName));
        }
            
        this.$element.append(this.renderColumn('closed'));

        this.sortIssues();

        this.applySortable();
    }
}

module.exports = BoardEditor;
