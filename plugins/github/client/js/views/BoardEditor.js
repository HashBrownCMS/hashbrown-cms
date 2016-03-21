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
            let labels = $issue.data('labels');

            let $column = view.$element.find('.column[data-name="backlog"]');

            if(labels) {
                for(let label of labels) {
                    let $foundColumn = view.$element.find('.column[data-name="' + label.name + '"]');

                    if($foundColumn.length > 0) {
                        $column = $foundColumn;
                        break;
                    }
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
     * Applies html5sortable plugin
     */
    applySortable() {
        this.$element.find('.column >.panel-body').sortable('destroy');

        this.$element.find('.column >.panel-body').sortable({
            items: '.issue',
            forcePlaceholderSize: true,
            connectWith: '.column .panel-body'
        }).on('sortstop', function(e, ui) {
            alert(ui.data('id'));
        });
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

                let $issue = _.div({
                    class: 'issue',
                    'data-id': issue.id,
                    'data-number': issue.number,
                    'data-milestone': issue.milestone ? issue.milestone.id : '',
                }, [
                    _.div({class: 'panel panel-default'}, [
                        _.div({class: 'panel-heading'},
                            _.h4({class: 'panel-title'},
                                issue.title
                            )
                        ),
                        _.div({class: 'panel-body issue-body'},
                            markdownToHtml(issue.body)
                        )
                    ])
                ]);

                $issue.data('labels', issue.labels);

                return $issue;
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
