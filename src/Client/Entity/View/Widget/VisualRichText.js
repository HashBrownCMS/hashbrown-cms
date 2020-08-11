'use strict';

const ProseMirror = {
    BasicSchema: require('prosemirror-schema-basic').schema,
    Commands: require('prosemirror-commands'),
    InputRules: require('prosemirror-inputrules'),
    DOMParser: require('prosemirror-model').DOMParser,
    DOMSerializer: require('prosemirror-model').DOMSerializer,
    EditorState: require('prosemirror-state').EditorState,
    EditorView: require('prosemirror-view').EditorView,
    Keymap: require('prosemirror-keymap').keymap,
    ListSchema: require('prosemirror-schema-list'),
    Schema: require('prosemirror-model').Schema
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

        this.def(ProseMirror.Schema, 'schema');
        this.def(ProseMirror.EditorView, 'editor');
    }

    /**
     * Initialises the editor
     */
    initEditor() {
        this.schema = this.buildSchema();
        this.editor = this.buildEditorView();
    }

    /**
     * Builds the editor view
     *
     * @return {ProseMirror.EditorView} Editor view
     */
    buildEditorView() {
        return new ProseMirror.EditorView(this.namedElements.editor, {
            state: ProseMirror.EditorState.create({
                doc: this.createEditorStateDocument(),
                plugins: this.buildPlugins()
            }),
            handleKeyPress: () => { this.updateParagraphTag(); },
            handleClick: () => { this.updateParagraphTag(); },
            dispatchTransaction: (tr) => { this.onDispatchTransaction(tr); },
        });
    }

    /**
     * Builds the schema
     *
     * @return {ProseMirror.Schema} Schema
     */
    buildSchema() {
        let nodes = ProseMirror.BasicSchema.spec.nodes;
        nodes = ProseMirror.ListSchema.addListNodes(nodes, 'paragraph block*', 'block');

        let marks = ProseMirror.BasicSchema.spec.marks;

        return new ProseMirror.Schema({ nodes: nodes, marks: marks });
    }

    /**
     * Builds the plugins
     *
     * @return {Array} Plugins
     */
    buildPlugins() {
        let rules = ProseMirror.InputRules.smartQuotes.concat(ProseMirror.InputRules.ellipsis, ProseMirror.InputRules.emDash);

        if(this.schema.nodes.blockquote) {
            rules.push(ProseMirror.InputRules.wrappingInputRule(
                /^\s*>\s$/,
                this.schema.nodes.blockquote
            ));
        }
        
        if(this.schema.nodes.ordered_list) {
            rules.push(ProseMirror.InputRules.wrappingInputRule(
                /^\s*>\s$/,
                this.schema.nodes.ordered_list,
                (match) => { return { order: +match[1] }; },
                (match, node) => { return node.childCount + node.attrs.order == +match[1]; }
            ));
        }
      
        if(this.schema.nodes.bullet_list) {
            rules.push(ProseMirror.InputRules.wrappingInputRule(
                /^\s*([-+*])\s$/,
                this.schema.nodes.bullet_list
            ));
        }
        
        if(this.schema.nodes.code_block) {
            rules.push(ProseMirror.InputRules.wrappingInputRule(
                /^\s*>\s$/,
                this.schema.nodes.code_block
            ));
        }

        if(this.schema.nodes.heading) {
            rules.push(ProseMirror.InputRules.wrappingInputRule(
                new RegExp("^(#{1,6})\\s$"),
                this.schema.nodes.heading,
                (match) => { return { level: match[1].length }; }
            ));
        }
        
        return [
            ProseMirror.Keymap(ProseMirror.Commands.baseKeymap),
            ProseMirror.Keymap({
                'Enter': ProseMirror.ListSchema.splitListItem(this.schema.nodes.list_item)
            }),
            ProseMirror.InputRules.inputRules({rules: rules})
        ];
    }

    /**
     * Initialises and returns a new editor state
     * 
     * @return {DOMDocument} Document
     */
    createEditorStateDocument() {
        let view = document.createElement('div');
        view.innerHTML = this.toView(this.model.value);

        return ProseMirror.DOMParser.fromSchema(this.schema).parse(view);
    }

    /**
     * Insert HTML
     *
     * @param {String} html
     */
    insertHtml(html) {
        this.model.value += html || '';

        let state = this.editor.state
        state.doc = this.createEditorStateDocument();
        
        ths.editor.updateState(state);
    }
    
    /**
     * Gets the HTML value
     *
     * @return {String} HTML
     */
    getHtml() {
        let html = '';
       
        let serializer = ProseMirror.DOMSerializer.fromSchema(this.schema);
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
     * Gets the selection as text
     *
     * @return {String} Text
     */
    getSelectionText() {
        let node = this.editor.state.doc.cut(this.editor.state.selection.from, this.editor.state.selection.to);
        let text = '';

        function recurse(n) {
            if(n.text) {
                text += n.text;
            
            } else if(n.content) {
                recurse(n.content);
            
            } else if(Array.isArray(n)) {
                for(let i in n) {
                    recurse(n[i]);
                }

            }
        }
        
        recurse(node);

        return text;
    }

    /**
     * Event: Dispatch transaction
     *
     * @param {ProseMirror.Transaction} transaction
     */
    onDispatchTransaction(transaction) {
        let state = this.editor.state.apply(transaction);

        this.editor.updateState(state);

        if(!transaction.docChanged) { return; }

        this.onChange();
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
            node = this.schema.nodes.paragraph;
        } else {
            node = this.schema.nodes.heading;
        }
            
        let cmd = ProseMirror.Commands.setBlockType(node, attrs);
            
        cmd(this.editor.state, this.editor.dispatch);
    }
    
    /**
     * Event: Click bold
     */
    onClickBold() {
        let cmd = ProseMirror.Commands.toggleMark(this.schema.marks.strong);
            
        cmd(this.editor.state, this.editor.dispatch);
    }
    
    /**
     * Event: Click italic
     */
    onClickItalic() {
        let cmd = ProseMirror.Commands.toggleMark(this.schema.marks.em);

        cmd(this.editor.state, this.editor.dispatch);
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
            cmd = ProseMirror.Commands.wrapIn(this.schema.nodes.blockquote);

        }
            
        cmd(this.editor.state, this.editor.dispatch);
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
            cmd = ProseMirror.Commands.wrapIn(this.schema.nodes.code_block);

        }
            
        cmd(this.editor.state, this.editor.dispatch);
    }

    /**
     * Event: Click ordered list
     */
    onClickOrderedList() {
        let cmd = null;
        let selection = this.editor.state.selection;
        let range = selection.$from.blockRange(selection.$to);
       
        if(range.parent.type.name === 'ordered_list') {
            cmd = ProseMirror.Commands.lift;

        } else if(range.parent.type.name === 'list_item') {
            cmd = ProseMirror.ListSchema.liftListItem(this.schema.nodes.list_item);

        } else {
            cmd = ProseMirror.ListSchema.wrapInList(this.schema.nodes.ordered_list);

        }
        
        cmd(this.editor.state, this.editor.dispatch);
    }
    
    /**
     * Event: Click unordered list
     */
    onClickUnorderedList() {
        let cmd = null;
        let selection = this.editor.state.selection;
        let range = selection.$from.blockRange(selection.$to);
       
        if(range.parent.type.name === 'bullet_list') {
            cmd = ProseMirror.Commands.lift;

        } else if(range.parent.type.name === 'list_item') {
            cmd = ProseMirror.ListSchema.liftListItem(this.schema.nodes.list_item);

        } else {
            cmd = ProseMirror.ListSchema.wrapInList(this.schema.nodes.bullet_list);

        }
        
        cmd(this.editor.state, this.editor.dispatch);
    }

    /**
     * Event: Click remove format
     */
    onClickRemoveFormat() {
        let selection = this.editor.state.selection;
        let markTypes = Object.values(this.schema.marks);

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
    }
    
    /**
     * Event: Create link
     */
    onClickLink() {
        let text = this.getSelectionText();
        
        if(!text) {
            return UI.notify('Create link', 'Please select some text first');
        }

        let selection = this.editor.state.selection;

        if(this.editor.state.doc.rangeHasMark(selection.from, selection.to, this.schema.marks.link)) {
            let cmd = ProseMirror.Commands.toggleMark(this.schema.marks.link);

            cmd(this.editor.state, this.editor.dispatch);
        
        } else {
            let modal = HashBrown.Entity.View.Modal.CreateLink.new({
                model: {
                    useText: false,
                    newTab: false
                }
            });

            modal.on('ok', (text, url, newTab) => {
                if(!url) { return; }
            
                let attrs = {
                    href: url,
                    target: newTab ? '_blank' : undefined
                };

                let cmd = ProseMirror.Commands.toggleMark(this.schema.marks.link, attrs);
           
                cmd(this.editor.state, this.editor.dispatch);
            });
        
        }
    }
}

module.exports = VisualRichText;
