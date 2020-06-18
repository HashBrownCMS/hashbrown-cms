'use strict';

const CodeMirror = {
    Editor: require('codemirror'),
    HtmlMode: require('codemirror/mode/htmlmixed/htmlmixed'),
    MatchTagsEditAddon: require('codemirror/addon/edit/matchtags')
};

/**
 * A HTML rich text widget
 *
 * @memberof HashBrown.Client.Entity.View.Widget
 */
class HtmlRichText extends HashBrown.Entity.View.Widget.RichText  {
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
        this.model.toolbar = null;
    }

    /**
     * Initialises the editor
     */
    initEditor() {
        this.editor = new CodeMirror.Editor(this.namedElements.editor, {
            value: this.toView(this.model.value),
            indentUnit: 4,
            lineNumbers: true,
            lineWrapping: true,
            matchTags: { bothTags: true },
            mode: 'htmlmixed'
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
     * Gets the HTML value
     *
     * @return {String} HTML
     */
    getHtml() {
        return this.editor.getValue();
    }
}

module.exports = HtmlRichText;
