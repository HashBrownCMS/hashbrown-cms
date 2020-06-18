'use strict';

const ProseMirror = {
    EditorView: require('prosemirror-view').EditorView,
    EditorState: require('prosemirror-state').EditorState,
    DOMParser: require('prosemirror-model').DOMParser,
    DOMSerializer: require('prosemirror-model').DOMSerializer,
    Schema: require('prosemirror-model').Schema,
    Transform: require('prosemirror-transform'),
    VisualSchema: require('prosemirror-schema-basic').schema,
    ListSchema: require('prosemirror-schema-list').schema,
    MarkdownSchema: require('prosemirror-markdown').schema,
    MarkdownSerializer: require('prosemirror-markdown').defaultMarkdownSerializer,
    MarkdownParser: require('prosemirror-markdown').defaultMarkdownParser,
    Commands: require('prosemirror-commands')
}

/**
 * A rich text widget
 *
 * @memberof HashBrown.Client.Entity.View.Widget
 */
class RichText extends HashBrown.Entity.View.Widget.WidgetBase  {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/widget/richText'); 

        this.model.toolbar = this.model.toolbar || {};
        this.state.paragraphOptions = this.getParagraphOptions();
    }

    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(ProseMirror.EditorView, 'editor');
    }

    /**
     * Fetches the model
     */
    async fetch() {
        let deployer = await HashBrown.Entity.Resource.Media.getDeployer();

        if(deployer) {
            this.state.mediaPath = '/' + deployer.path.split('/').filter(Boolean).join('/');
        } else {
            this.state.mediaPath = '/media';
        }
    }

    /**
     * Post render
     */
    postrender() {
        if(this.model.disabled) {
            return this.namedElements.editor.innerHTML = this.toView(this.model.value);
        }
        
        let view = document.createElement('div');
        view.innerHTML = this.toView(this.model.value);

        let schema =  this.isMarkdown? ProseMirror.MarkdownSchema : ProseMirror.VisualSchema;
        let doc = ProseMirror.DOMParser.fromSchema(schema).parse(view);

        this.editor = new ProseMirror.EditorView(this.namedElements.editor, {
            state: ProseMirror.EditorState.create({ doc: doc }),
            handleKeyPress: () => { this.updateParagraphTag(); },
            handleClick: () => { this.updateParagraphTag(); }
        });
    }

    /**
     * Event: Value changed
     */
    onChange() {
        let newValue = this.toValue(this.getHtml());

        super.onChange(newValue);
    }

    /**
     * Gets whether we're in markdown mode
     *
     * @return {Boolean} Is markdown
     */
    get isMarkdown() {
        return this.model.markdown === true;
    }

    /**
     * Insert HTML
     *
     * @param {String} html
     */
    insertHtml(html) {
        if(!html) { return; }

        this.namedElements.output.innerHTML += this.toView(html);

        this.onChange();
    }

    /**
     * Gets the HTML value
     *
     * @return {String} HTML
     */
    getHtml() {
        let html = '';
       
        if(this.isMarkdown) {

        } else {
            let serializer = ProseMirror.DOMSerializer.fromSchema(ProseMirror.VisualSchema);
            let fragment = serializer.serializeFragment(this.editor.state.doc.content);

            for(let child of fragment.children) {
                html += child.outerHTML;
            }
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
     * Converts HTML to view format, replacing media references
     *
     * @param {String} html
     *
     * @return {String} HTML
     */
    toView(html) {
        if(!html) { return ''; }

        return this.replaceMediaReferences(html, (id, filename) => {
            return `/media/${this.context.project.id}/${this.context.environment}/${id}`;
        });
    }

    /**
     * Converts HTML to value format, replacing media references
     *
     * @param {String} html
     *
     * @return {String} HTML
     */
    toValue(html) {
        if(!html) { return ''; }
        
        return this.replaceMediaReferences(html, (id, filename) => {
            return `${this.state.mediaPath}/${id}/${filename}`;
        });
    }

    /**
     * Replaces media references
     *
     * @param {String} html
     * @param {Function} urlHandler
     *
     * @return {String} HTML
     */
    replaceMediaReferences(html, urlHandler) {
        if(!html || !urlHandler) { return html; }
        
        return html.replace(/<[^>]*src="[^"]+"[^>]*>(<\/[^>]*>)?/g, (elementHtml) => {
            let temp = document.createElement('div');
            temp.innerHTML = elementHtml;

            let element = temp.firstChild;

            let id = null;
            let filename = element.getAttribute('title') || element.getAttribute('alt');
            let source = element.getAttribute('src');

            if(source.indexOf('http') === 0 || source.indexOf('//') === 0) {
                return elementHtml;
            }

            let sourceParts = element.getAttribute('src').split('/');

            for(let part of sourceParts) {
                if(part.indexOf('.') > -1) {
                    filename = part;
                } else {
                    id = part;
                }
            }

            element.setAttribute('title', filename);
            element.setAttribute('alt', filename);
            element.setAttribute('src', urlHandler(id, filename));
            
            return element.outerHTML;
        });
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
            if(this.isMarkdown) {
                node = ProseMirror.MarkdownSchema.nodes.paragraph;
            } else {
                node = ProseMirror.VisualSchema.nodes.paragraph;
            }
        } else {
            if(this.isMarkdown) {
                node = ProseMirror.MarkdownSchema.nodes.heading;
            } else {
                node = ProseMirror.VisualSchema.nodes.heading;
            }
        }
            
        let cmd = ProseMirror.Commands.setBlockType(node, attrs);
            
        cmd(this.editor.state, this.editor.dispatch);
    }

    /**
     * Event: Click bold
     */
    onClickBold() {
        let cmd = null;

        if(this.isMarkdown) {
            cmd = ProseMirror.Commands.toggleMark(ProseMirror.MarkdownSchema.marks.strong);
            console.log(ProseMirror.MarkdownSchema.marks.strong);
            
        } else {
            cmd = ProseMirror.Commands.toggleMark(ProseMirror.VisualSchema.marks.strong);

        }
            
        cmd(this.editor.state, this.editor.dispatch);
    }
    
    /**
     * Event: Click italic
     */
    onClickItalic() {
        let cmd = null;

        if(this.isMarkdown) {
            cmd = ProseMirror.Commands.toggleMark(ProseMirror.MarkdownSchema.marks.em);
            
        } else {
            cmd = ProseMirror.Commands.toggleMark(ProseMirror.VisualSchema.marks.em);

        }
            
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

        } else if(this.isMarkdown) {
            cmd = ProseMirror.Commands.wrapIn(ProseMirror.MarkdownSchema.nodes.blockquote);
                
        } else {
            cmd = ProseMirror.Commands.wrapIn(ProseMirror.VisualSchema.nodes.blockquote);

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
        
        } else if(this.isMarkdown) {
            cmd = ProseMirror.Commands.wrapIn(ProseMirror.MarkdownSchema.nodes.code_block);
            
        } else {
            cmd = ProseMirror.Commands.wrapIn(ProseMirror.VisualSchema.nodes.code_block);

        }
            
        cmd(this.editor.state, this.editor.dispatch);
    }

    /**
     * Event: Click ordered list
     */
    onClickOrderedList() {
        
    }
    
    /**
     * Event: Click unordered list
     */
    onClickUnorderedList() {
        
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

    /**
     * Gets toolbar elements
     *
     * @param {String} category
     *
     * @return {Array} Elements
     */
    static getToolbarElements(category) {
        checkParam(category, 'category', String, true);

        let elements = {};

        switch(category) {
            case 'paragraphs':
                elements = {
                    h1: 'Header 1',
                    h2: 'Header 2',
                    h3: 'Header 3',
                    h4: 'Header 4',
                    h5: 'Header 5',
                    h6: 'Header 6'
                };
                break;
            
            case 'blocks':
                elements = {
                    quotation: 'Quotation',
                    code: 'Code'
                };
                break;

            case 'style':
                elements = {
                    bold: 'Bold',
                    italic: 'Italic',
                    underline: 'Underline',
                    color: 'Color'
                };
                break;
            
            case 'lists':
                elements = {
                    orderedList: 'Ordered',
                    unorderedList: 'Unordered'
                };
                break;
            
            case 'positioning':
                elements = {
                    indent: 'Indent',
                    outdent: 'Outdent',
                    alignLeft: 'Align left',
                    center: 'Center', 
                    justify: 'Justify',
                    alignRight: 'Align right'
                };
                break;
            
            default:
                throw new Error('Toolbar element category "' + category + '" not recognised');
        }

        return elements;
    }


    /**
     * Gets all paragraph options
     *
     * @returns {Object} Options
     */
    getParagraphOptions() {
        let options = this.constructor.getToolbarElements('paragraphs');

        for(let key in options) {
            if(!this.model.toolbar || this.model.toolbar[key] === false) { delete options[key]; }
        }
       
        options.p = 'Paragraph';

        // Reverse keys and values for the popup widget
        for(let key in options) {
            let value = options[key];

            delete options[key];

            options[value] = key;
        }

        return options;
    }
}

module.exports = RichText;
