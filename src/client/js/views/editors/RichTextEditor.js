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
        this.$output.html(markdownToHtml(this.$textarea.val()));

        this.caret = this.getCaretCharacterOffsetWithin(this.$textarea[0]);

        this.trigger('change', this.$textarea.val());
    }

    /**
     * Updates the textarea
     */
    updateTextArea() {
        this.$textarea.val(htmlToMarkdown(this.$output.html()));

        this.trigger('change', this.$textarea.val());
    }

    /**
     * Event: Click bold
     */
    onClickBold() {
        document.execCommand('bold', false, null);

        this.updateTextArea();
    }
    
    /**
     * Event: Click italic
     */
    onClickItalic() {
        document.execCommand('italic', false, null);

        this.updateTextArea();
    }
    
    /**
     * Event: Click header
     */
    onClickHeader(num) {
        document.execCommand('formatBlock', false, '<' + num + '>');

        console.log(num);

        this.updateTextArea();
    }

    /**
     * Gets the caret offset within an element
     *
     * @param {HTMLElement} element
     *
     * @returns {Number} offset
     */
    getCaretCharacterOffsetWithin(element) {
        var pos = 0;
        if('selectionStart' in element) {
            pos = element.selectionStart;
        } else if('selection' in document) {
            element.focus();
            var Sel = document.selection.createRange();
            var SelLength = document.selection.createRange().text.length;
            Sel.moveStart('character', -element.value.length);
            pos = Sel.text.length - SelLength;
        }
        return pos;
    }

    /**
     * Sets the selection range in an input
     *
     * @param {HTMLElement} input
     * @param {Number} selectionStart
     * @param {Number} selectionEnd
     */
    setSelectionRange(input, selectionStart, selectionEnd) {
        input.focus();

        if(input.setSelectionRange) {
            input.setSelectionRange(selectionStart, selectionEnd);
        
        } else if (input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', selectionEnd);
            range.moveStart('character', selectionStart);
            range.select();
        
        }
    }

    /**
     * Sets the caret position in an input
     *
     * @param {HTMLElement} input
     * @param {Number} pos
     */
    setCaretToPos(input, pos) {
        this.setSelectionRange(input, pos, pos);
    }

    render() {
        var editor = this;

        // Main element
        this.$element = _.div({class: 'field-editor rich-text-editor panel panel-default'}, [
            // Toolbar
            _.div({class: 'panel-heading'}, 
                _.div({class: 'dropdown'},
                    _.button({class: 'btn btn-primary dropdown-toggle', 'data-toggle': 'dropdown'},
                        _.span({class: 'fa fa-header'})
                    ),
                    _.ul({class: 'dropdown-menu'},
                        _.each([1, 2, 3, 4, 5, 6], (i, num) => {
                            return _.li(
                                _.a({href: '#'},
                                    'H' + num
                                ).click(function(e) {
                                    e.preventDefault();
                                        
                                    editor.onClickHeader(num);
                                })
                            );
                        })
                    )
                ),
                _.button({class: 'btn btn-primary', 'data-wrap': 'strong'}, 
                    _.span({class: 'fa fa-bold'})
                ).click(() => { this.onClickBold(); }),
                _.button({class: 'btn btn-primary', 'data-wrap': 'em'}, 
                    _.span({class: 'fa fa-italic'})
                ).click(() => { this.onClickItalic(); })
            ),

            // HTML output 
            _.div({class: 'panel-body'},
                this.$output = _.div({class: 'rte-output', contenteditable: true})
                    .on('change propertychange keyup paste', function() {
                        editor.updateTextArea();
                    })
            ),

            // Markdown editor
            _.div({class: 'panel-footer'},
                this.$textarea = _.textarea({class: 'form-control', type: 'text'}, 
                    this.value
                ).on('change propertychange keyup paste', function() {
                    editor.onChange();
                })
            )
        ]);

        // Initial call to render markdown as HTML
        this.$output.html(markdownToHtml(this.$textarea.val()));

        this.onChange();
    }
}

module.exports = RichTextEditor;
