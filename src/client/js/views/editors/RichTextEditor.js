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

        this.$output.find('img').each(function() {
            let id = $(this).attr('alt');
            let src = '/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + id;
        
            $(this).attr('src', src);
        });

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
     * Event: Change heading
     */
    onChangeHeading() {
        let num = parseInt(this.$element.find('.panel-heading select').val());

        document.execCommand('formatBlock', false, '<' + num + '>');

        this.updateTextArea();
    }

    /**
     * Event: Click insert media
     */
    onClickInsertMedia() {
        let editor = this;

        /** 
         * Event: Click OK
         */
        function onClickOK() {
            let id = $modal.find('.thumbnail.active').attr('data-id');
            
            MediaHelper.getMediaById(id)
            .then((media) => {
                editor.$textarea.val(editor.$textarea.val() + '\n' + '![' + media.id + '](' + media.url + ')');

                editor.onChange();
                $modal.modal('hide');
            })
            .catch(errorModal);
        }

        // Render the modal
        let $modal = _.div({class: 'modal fade media-modal'},
            _.div({class: 'modal-dialog'},
                _.div({class: 'modal-content'}, [
                    _.div({class: 'modal-header'},
                        _.input({class: 'form-control', placeholder: 'Search media'})
                    ),
                    _.div({class: 'modal-body'},
                        _.div({class: 'thumbnail-container'},
                            _.each(resources.media, function(i, media) {
                                function onClick() {
                                    $modal.find('.thumbnail').toggleClass('active', false);
                                    $(this).toggleClass('active', true);
                                }
                                
                                return _.button(
                                    {
                                        class: 'thumbnail raised',
                                        'data-id': media.id,
                                        style: 'background-image: url(\'/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + media.id + '\')'
                                    },
                                    _.label(media.name)  
                                ).click(onClick);
                            })
                        )
                    ),
                    _.div({class: 'modal-footer'},
                        _.button({class: 'btn btn-primary'},
                            'OK'
                        ).click(onClickOK)
                    )
                ])
            )
        );

        // Make sure the modal is removed when it's cancelled
        $modal.on('hidden.bs.modal', function() {
           $modal.remove(); 
        });

        // Show the modal
        $modal.modal('show');
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
        let editor = this;

        // Main element
        this.$element = _.div({class: 'field-editor rich-text-editor panel panel-default'}, [
            // Toolbar
            _.div({class: 'panel-heading'}, 
                _.select({class: 'form-control btn btn-primary'},
                    _.each([1, 2, 3, 4, 5, 6], (i, num) => {
                        return _.option({value: 'h' + num}, 'H' + num);
                    })
                ).change((e) => { this.onChangeHeading(); }),
                _.button({class: 'btn btn-primary'}, 
                    _.span({class: 'fa fa-bold'})
                ).click(() => { this.onClickBold(); }),
                _.button({class: 'btn btn-primary'}, 
                    _.span({class: 'fa fa-italic'})
                ).click(() => { this.onClickItalic(); }),
                _.button({class: 'btn btn-primary'}, 
                    _.span({class: 'fa fa-file-image-o'})
                ).click(() => { this.onClickInsertMedia(); })
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
