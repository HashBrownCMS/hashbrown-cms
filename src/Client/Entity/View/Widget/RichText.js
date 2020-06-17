'use strict';

const ProseMirror = {
    EditorView: require('prosemirror-view').EditorView,
    EditorState: require('prosemirror-state').EditorState,
    DOMParser: require('prosemirror-model').DOMParser,
    Schema: require('prosemirror-model').Schema,
    Transform: require('prosemirror-transform').Transform,
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

        this.model.value = HashBrown.Service.MarkdownService.toHtml(this.model.value);

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
        this.namedElements.output.innerHTML = this.toView(this.model.value);

        let schema = ProseMirror.VisualSchema;

        this.editor = new ProseMirror.EditorView(this.namedElements.editor, {
            state: ProseMirror.EditorState.create({
                doc: ProseMirror.DOMParser.fromSchema(schema).parse(this.namedElements.output)
            })
        });
    }

    /**
     * Event: Value changed via the input
     */
    onChangeInput() {
        let newValue = this.toValue(this.isMarkdown ?
            HashBrown.Service.MarkdownService.toHtml(this.namedElements.editor.value) :
            this.namedElements.editor.inenrHTML
        );

        if(this.isMarkdown) {
            this.namedElements.preview.innerHTML = this.toView(newValue, 'html');
        }

        super.onChange(newValue);
    }

    /**
     * Event: Value changed programmatically
     */
    onChange() {
        let newValue = this.toValue(this.isMarkdown ? 
            this.namedElements.preview.innerHTML :
            this.namedElements.editor.innerHTML
        );

        if(this.isMarkdown) {
            this.namedElements.editor.value = HashBrown.Service.MarkdownService.toMarkdown(this.namedElements.preview.innerHTML);
        }

        this.clearSelection();

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

        if(this.isMarkdown) {
            this.namedElements.editor.value += this.toView(html, 'markdown');
        } else {
            this.namedElements.editor.innerHTML += this.toView(html, 'html');
        }

        this.onChange();
    }

    /**
     * Updates the paragraph picker and selection tag
     */
    updateElementTag () {
        let paragraphPicker = this.namedElements.paragraph;
        
        if(!paragraphPicker) { return; }

        let selection = this.getSelection();

        if(!selection) { return; }

        let textNode = selection.anchorNode;

        if(!textNode) { return; }
        
        let parentElement = textNode.parentElement;
       
        if(!parentElement) { return; }
        
        let parentElementTagName = parentElement.tagName.toLowerCase();

        // If a media objects is involved, use it as reference
        if(textNode.children) {
            for(let i = 0; i < textNode.children.length; i++) {
                if(textNode.children[i].hasAttribute('src')) {
                    parentElementTagName = textNode.children[i].parentElement.tagName.toLowerCase();
                    break;
                }
            }
        }

        // If the parent tag is not a heading or a paragraph, default to paragraph
        if(!paragraphPicker.hasOption(parentElementTagName)) {
            parentElementTagName = 'p';
        }

        paragraphPicker.setValue(parentElementTagName);
    }

    /**
     * Converts HTML to view format, replacing media references
     *
     * @param {String} html
     * @param {String} mode
     *
     * @return {String} HTML
     */
    toView(html, mode) {
        if(!html) { return ''; }

        html = this.replaceMediaReferences(html, (id, filename) => {
            return `/media/${this.context.project.id}/${this.context.environment}/${id}`;
        });
        
        if(mode === 'markdown') {
            html = HashBrown.Service.MarkdownService.toMarkdown(html);
        }

        return html;
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
        
        // Replace divs with pararaphs
        html = html.replace(/<div>/g, '<p>').replace(/<\/div>/g, '</p>');

        // Replace media references
        return this.replaceMediaReferences(html, (id, filename) => {
            return `${this.state.mediaPath}/${id}/${filename}`;
        });
    }

    /**
     * Converts HTML to plain text
     *
     * @param {String} html
     *
     * @return {String{ Plain text
     */
    toPlainText(html) {
        if(!html) { return ''; }

        let temp = document.createElement('div');
        temp.innerHTML = html;

        return temp.textContent || temp.innerText || '';
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
     * Event: Click ordered list
     */
    onClickOrderedList() {
        
    }

    /**
     * Event: Click remove format
     */
    onClickRemoveFormat() {
        let selection = this.getSelection();
        let range = selection.getRangeAt(0);
        let node = document.createTextNode(selection.toString());

        range.deleteContents();
        range.insertNode(node);

        node.parentElement.normalize();
        
        this.onChange();
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
                throw new Error('WYSIWYG toolbar element category "' + category + '" not recognised');
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
