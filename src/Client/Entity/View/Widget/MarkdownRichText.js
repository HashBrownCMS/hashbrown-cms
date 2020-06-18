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
            lineWrapping: true,
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
    insertHtml(html) {
        html = this.toView(html);

        let markdown = HashBrown.Service.MarkdownService.toMarkdown(html);

        this.editor.replaceSelection(markdown);
    }
    
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
        let patterns = {
            '^\\*[ ]*': '',
            '^[0-9]+\. ': '',
            '^>[ ]': '',
            '^    ': '',
            '\\*\\*(.+)\\*\\*': (m, s) => { return s; },
            '_([^_]+)_': (m, s) => { return s; },
            '\\[(.+)\\]\\(.+\\)': (m, s) => { return s; },
            '^=+': '',
            '^-+': ''
        };
        
        let separator = 'separator-' + Date.now();
        let from = this.editor.getCursor('from');
        let to = this.editor.getCursor('to');
        let lines = this.editor.getSelection(separator).split(separator);

        for(let i in lines) {
            let line = lines[i];

            for(let pattern in patterns) {
                let replace = patterns[pattern];
                let regex = new RegExp(pattern, 'g');
              
                line = line.replace(regex, replace);
            }

            lines[i] = line;
        }
            
        this.editor.replaceRange(lines.join('\n'), from, to);
    }
    
    /**
     * Event: Create link
     */
    onClickLink() {
        let selection = this.editor.getSelection();
        
        if(!selection) {
            return UI.notify('Create link', 'Please select some text first');
        }

        let from = this.editor.getCursor('from');
        let to = this.editor.getCursor('to');
        let match = selection.match(/\[(.*)\]\((.*)\)/);

        let modal = HashBrown.Entity.View.Modal.CreateLink.new({
            model: {
                text: match ? match[1] : selection,
                url: match ? match[2] : '',
                useNewTab: false
            }
        });

        modal.on('ok', (text, url, newTab) => {
            if(!text || !url) { return; }

            this.editor.replaceRange(`[${text}](${url})`, from, to); 
            
            this.onChange();
        });
    }
}

module.exports = MarkdownRichText;
