'use strict';

const CodeMirror = {
    Editor: require('codemirror'),
    MarkdownMode: require('codemirror/mode/markdown/markdown')
};

/**
 * A markdown rich text widget
 *
 * @memberof HashBrown.Client.Entity.View.Widget
 */
class MarkdownRichText extends HashBrown.Entity.View.Widget.RichText  {
    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(CodeMirror.Editor, 'editor');
    }

    /**
     * Pre render
     */
    prerender() {
        this.model.toolbar.alignLeft = false;
        this.model.toolbar.center = false;
        this.model.toolbar.justify = false;
        this.model.toolbar.alignRight = false;
    }

    /**
     * Initialises the editor
     */
    initEditor() {
        this.editor = new CodeMirror.Editor(this.namedElements.editor, {
            value: this.toView(this.model.value),
            indentUnit: 4,
            mode: 'markdown'
        });

        this.editor.on('cursorActivity', () => {
            this.updateParagraphTag();
        });

        this.editor.on('change', () => {
            this.onChange();
        });
    }
    
    /**
     * Insert HTML
     *
     * @param {String} html
     */
    insertHtml(html) {}
    
    /**
     * Converts HTML to view format, replacing media references
     *
     * @param {String} html
     *
     * @return {String} HTML
     */
    toView(html) {
        html = super.toView(html);

        return HashBrown.Service.MarkdownService.toMarkdown(html);
    }
    
    /**
     * Gets the HTML value
     *
     * @return {String} HTML
     */
    getHtml() {
        return HashBrown.Service.MarkdownService.toHtml(this.editor.getValue());
    }
    
    /**
     * Updates the paragraph picker and selection tag
     */
    updateParagraphTag () {
        let paragraphPicker = this.namedElements.paragraph;
       
        if(!paragraphPicker) { return; }

        let tagName = 'p';
       
        let cursor = this.editor.getCursor();
        let tokens = [
            this.editor.getLineTokens(cursor.line),
            this.editor.getLineTokens(cursor.line + 1)
        ];

        if(!tokens[0]) { tokens[0] = []; }
        if(!tokens[0][0]) { tokens[0][0] = { string: '' }; }
        if(!tokens[1]) { tokens[1] = []; }
        if(!tokens[1][0]) { tokens[1][0] = { string: '' }; }

        if(
            tokens[0][0].string === '# ' ||
            tokens[1][0].string.indexOf('====') === 0
        ) {
            tagName = 'h1';
        
        } else if(
            tokens[0][0].string === '## ' ||
            tokens[1][0].string.indexOf('----') === 0
        ) {
            tagName = 'h2';
            
        } else if(tokens[0][0].string === '### ') {
            tagName = 'h3';
            
        } else if(tokens[0][0].string === '#### ') {
            tagName = 'h4';
            
        } else if(tokens[0][0].string === '##### ') {
            tagName = 'h5';
            
        } else if(tokens[0][0].string === '###### ') {
            tagName = 'h6';
            
        }
        
        paragraphPicker.setValue(tagName);
    }
    
    /**
     * Toggle the first token on each line of the current selection
     *
     * @param {RegExp} pattern
     * @param {Function|String} replace
     */
    toggleSelectionFirstToken(pattern, replace) {
        let from = this.editor.getCursor('from').line;
        let to = this.editor.getCursor('to').line;
        let isMarked = undefined;
        let n = 0;

        for(let i = from; i <= to; i++) {
            let token = typeof replace === 'function' ? replace(n) : replace;
            let tokens = this.editor.getLineTokens(i);

            if(isMarked === undefined) {
                isMarked = !!tokens[0].string.match(pattern);
            }
            
            if(isMarked && tokens[0].string.match(pattern)) {
                this.editor.replaceRange('', { line: i, ch: 0 }, { line: i, ch: token.length }); 
            } else if(!isMarked && !tokens[0].string.match(pattern)) {
                this.editor.replaceRange(token, { line: i, ch: 0 }, { line: i, ch: 0 }); 
            }
            
            n++;
        }
    }

    /**
     * Event: Change paragraph
     *
     * @param {String} tagName
     */
    onChangeParagraph(tagName) {
        let cursor = this.editor.getCursor();
        let tokens = [
            this.editor.getLineTokens(cursor.line),
            this.editor.getLineTokens(cursor.line + 1)
        ];

        if(!tokens[0]) { tokens[0] = []; }
        if(!tokens[0][0]) { tokens[0][0] = { string: '' }; }
        if(!tokens[1]) { tokens[1] = []; }
        if(!tokens[1][0]) { tokens[1][0] = { string: '' }; }

        if(
            tokens[0][0].string === '# ' ||
            tokens[1][0].string.indexOf('====') === 0
        ) {
            tagName = 'h1';
        
        } else if(
            tokens[0][0].string === '## ' ||
            tokens[1][0].string.indexOf('----') === 0
        ) {
            tagName = 'h2';
            
        } else if(tokens[0][0].string === '### ') {
            tagName = 'h3';
            
        } else if(tokens[0][0].string === '#### ') {
            tagName = 'h4';
            
        } else if(tokens[0][0].string === '##### ') {
            tagName = 'h5';
            
        } else if(tokens[0][0].string === '###### ') {
            tagName = 'h6';
            
        }
    }
    
    /**
     * Event: Click bold
     */
    onClickBold() {
        let selection = this.editor.getSelection();
        let isBold = selection.slice(0, 2) === '**' && selection.slice(-2) === '**';
        
        this.editor.replaceSelection(isBold ? selection.slice(2, -2) : '**' + selection + '**', 'around');
    }
    
    /**
     * Event: Click italic
     */
    onClickItalic() {
        let selection = this.editor.getSelection();
        let isItalic = selection.slice(0, 1) === '_' && selection.slice(-1) === '_';
        
        this.editor.replaceSelection(isItalic ? selection.slice(1, -1) : '_' + selection + '_', 'around');
    }

    /**
     * Event: Click quotation
     */
    onClickQuotation() {
        this.toggleSelectionFirstToken(/> /, '> ');
    }
    
    /**
     * Event: Click code
     */
    onClickCode() {
        this.toggleSelectionFirstToken(/    /, '    ');
    }

    /**
     * Event: Click ordered list
     */
    onClickOrderedList() {
        this.toggleSelectionFirstToken(/[0-9]+\. /, (i) => `${i+1}. `);
    }
    
    /**
     * Event: Click unordered list
     */
    onClickUnorderedList() {
        this.toggleSelectionFirstToken(/\* /, '* ');
    }

    /**
     * Event: Click remove format
     */
    onClickRemoveFormat() {
        let from = this.editor.getCursor('from').line;
        let to = this.editor.getCursor('to').line;
        let pattern = /\* |[0-9]+\. |> |    |\*\*|_|^=+|^-+/;

        for(let i = from; i <= to; i++) {
            let line = this.editor.getLine(i);
            let tokens = this.editor.getLineTokens(i);
           
            for(let i = tokens.length - 1; i >= 0; i--) {
                if(!tokens[i].string.match(pattern)) { continue; }

                tokens.splice(i, 1);
            }
            
            let result = '';

            for(let token of tokens) {
                result += token.string;
            }

            this.editor.replaceRange(result, { line: i, ch: 0 }, { line: i, ch: line.length }); 
        }
    }
    
    /**
     * Event: Create link
     */
    onClickLink() {
        let selection = this.getSelection();
        let anchorOffset = selection.anchorOffset;
        let focusOffset = selection.focusOffset;
        let anchorNode = selection.anchorNode;
        let range = selection.getRangeAt(0);
        let text = selection.toString();

        if(Math.abs(anchorOffset - focusOffset) < 1) {
            return UI.notify('Create link', 'Please select some text first');
        }

        let modal = HashBrown.Entity.View.Modal.CreateLink.new({
            model: {
                url: anchorNode.parentElement.getAttribute('href'),
                newTab: false
            }
        });

        modal.on('ok', (url, newTab) => {
            if(!url) { return; }

            selection = this.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            document.execCommand('createLink', false, url);

            setTimeout(() => {
                let a = selection.anchorNode.parentElement.querySelector('a');

                if(!a) { return; }

                if(newTab) {
                    a.setAttribute('target', '_blank');
                } else {
                    a.removeAttribute('target');
                }

                this.onChange();
            }, 10);
        });
    }
}

module.exports = MarkdownRichText;
