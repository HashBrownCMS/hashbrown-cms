'use strict';

// Lib
let markdownToHtml = require('marked');
let htmlToMarkdown = require('to-markdown');

/**
 * A rich text editor
 */
class RichTextEditor extends View {
    constructor(params) {
        super(params);

        this.init();
    }

    /**
     * Event: Change input
     */
    onChange() {
        this.trigger('change', this.$textarea.val());
    }

    render() {
        var editor = this;

        // Main element
        this.$element = _.div({class: 'field-editor rich-text-editor panel panel-default'}, [
            // Toolbar
            _.div({class: 'panel-heading'}, 
                _.div({class: 'btn-group'}, [
                    _.button({class: 'btn btn-default', 'data-wrap': 'strong'}, 
                        _.span({class: 'fa fa-bold'})
                    ),
                    _.button({class: 'btn btn-default', 'data-wrap': 'em'}, 
                        _.span({class: 'fa fa-italic'})
                    )
                ])
            ),
            
            // HTML output 
            _.div({class: 'panel-body'},
                this.$output = _.div({class: 'rte-output', contenteditable: true})
                    .bind('change propertychange keyup paste', function() {
                        editor.$textarea.val(htmlToMarkdown(editor.$output.html()));
                    
                        editor.onChange();
                    })
            ),

            // Markdown editor
            _.div({class: 'panel-footer'},
                this.$textarea = _.textarea({class: 'form-control', type: 'text'}, 
                    this.value
                ).bind('change propertychange keyup paste', function() {
                    editor.$output.html(markdownToHtml(editor.$textarea.val()));

                    editor.onChange();
                })
            )
        ]);

        // Initial call to render markdown as HTML
        this.$output.html(markdownToHtml(this.$textarea.val()));
    }
}

module.exports = RichTextEditor;
