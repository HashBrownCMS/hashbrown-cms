'use strict';

const ProseMirror = {
    EditorView: require('prosemirror-view').EditorView,
    EditorState: require('prosemirror-state').EditorState,
    DOMParser: require('prosemirror-model').DOMParser,
    DOMSerializer: require('prosemirror-model').DOMSerializer,
    Schema: require('prosemirror-model').Schema,
    VisualSchema: require('prosemirror-schema-basic').schema,
    ListSchema: require('prosemirror-schema-list').schema,
    Commands: require('prosemirror-commands'),
    Keymap: require('prosemirror-keymap')
}

/**
 * A visual rich text widget
 *
 * @memberof HashBrown.Client.Entity.View.Widget
 */
class VisualRichText extends HashBrown.Entity.View.Widget.RichText  {
    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(ProseMirror.EditorView, 'editor');
    }

    /**
     * Initialises the editor
     */
    initEditor() {
        let view = document.createElement('div');
        view.innerHTML = this.toView(this.model.value);

        let doc = ProseMirror.DOMParser.fromSchema(ProseMirror.VisualSchema).parse(view);
    
        this.editor = new ProseMirror.EditorView(this.namedElements.editor, {
            state: ProseMirror.EditorState.create({ doc: doc }),
            handleKeyPress: () => { this.updateParagraphTag(); },
            handleClick: () => { this.updateParagraphTag(); },
            handleTextInput: () => { this.onChange(); },
            plugins: [
                ProseMirror.Keymap.keymap(ProseMirror.Commands.baseKeymap) 
            ]
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
        let html = '';
       
        let serializer = ProseMirror.DOMSerializer.fromSchema(ProseMirror.VisualSchema);
        let fragment = serializer.serializeFragment(this.editor.state.doc.content);

        for(let child of fragment.children) {
            html += child.outerHTML;
        }

        return html;
    }
    
    /**
     * Updates the paragraph picker and selection tag
     */
    updateParagraphTag () {
        let paragraphPicker = this.namedElements.paragraph;
       
        if(!paragraphPicker) { return; }

        let selection = this.editor.state.selection;
        let range = selection.$from.blockRange(selection.$to);

        let tagName = 'p';

        if(range.$from.sameParent(range.$to) && range.$from.parent.type.name === 'heading') {
            tagName = `h${range.$from.parent.attrs.level}`;
        }

        paragraphPicker.setValue(tagName);
    }
    
    /**
     * Event: Change paragraph
     *
     * @param {String} tagName
     */
    onChangeParagraph(tagName) {
        let node = null;
        let attrs = {};
            
        if(tagName !== 'p') {
            attrs.level = parseInt(tagName.substring(1));
        }

        if(tagName === 'p') {
            node = ProseMirror.VisualSchema.nodes.paragraph;
        } else {
            node = ProseMirror.VisualSchema.nodes.heading;
        }
            
        let cmd = ProseMirror.Commands.setBlockType(node, attrs);
            
        cmd(this.editor.state, this.editor.dispatch);

        this.onChange();
    }
    
    /**
     * Event: Click bold
     */
    onClickBold() {
        let cmd = ProseMirror.Commands.toggleMark(ProseMirror.VisualSchema.marks.strong);
            
        cmd(this.editor.state, this.editor.dispatch);

        this.onChange();
    }
    
    /**
     * Event: Click italic
     */
    onClickItalic() {
        let cmd = ProseMirror.Commands.toggleMark(ProseMirror.VisualSchema.marks.em);

        cmd(this.editor.state, this.editor.dispatch);

        this.onChange();
    }

    /**
     * Event: Click quotation
     */
    onClickQuotation() {
        let cmd = null;
        let selection = this.editor.state.selection;
        let range = selection.$from.blockRange(selection.$to);

        if(range.parent.type.name === 'blockquote') {
            cmd = ProseMirror.Commands.lift;

        } else {
            cmd = ProseMirror.Commands.wrapIn(ProseMirror.VisualSchema.nodes.blockquote);

        }
            
        cmd(this.editor.state, this.editor.dispatch);

        this.onChange();
    }
    
    /**
     * Event: Click code
     */
    onClickCode() {
        let cmd = null;
        let selection = this.editor.state.selection;
        let range = selection.$from.blockRange(selection.$to);

        if(range.parent.type.name === 'code_block') {
            cmd = ProseMirror.Commands.lift;
        
        } else {
            cmd = ProseMirror.Commands.wrapIn(ProseMirror.VisualSchema.nodes.code_block);

        }
            
        cmd(this.editor.state, this.editor.dispatch);

        this.onChange();
    }

    /**
     * Event: Click ordered list
     */
    onClickOrderedList() {
        // TODO: Implement 

        this.onChange();
    }
    
    /**
     * Event: Click unordered list
     */
    onClickUnorderedList() {
        // TODO: Implement 

        this.onChange();
    }

    /**
     * Event: Click remove format
     */
    onClickRemoveFormat() {
        let selection = this.editor.state.selection;
        let markTypes = Object.values(ProseMirror.MarkdownSchema.marks).concat(Object.values(ProseMirror.VisualSchema.marks));

        for(let markType of markTypes) {
            let tr = this.editor.state.tr;
            let hasMark = false;

            for(let i = 0; !hasMark && i < selection.ranges.length; i++) {
                let {$from, $to} = selection.ranges[i];

                hasMark = this.editor.state.doc.rangeHasMark($from.pos, $to.pos, markType);
            }

            for(let i = 0; i < selection.ranges.length; i++) {
                let {$from, $to} = selection.ranges[i];

                tr.removeMark($from.pos, $to.pos, markType);
            }
            
            this.editor.dispatch(tr.scrollIntoView());
        }
        
        this.onChange();
    }
    
    /**
     * Event: Create link
     */
    onClickLink() {
        // TODO: Implement
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

module.exports = VisualRichText;
