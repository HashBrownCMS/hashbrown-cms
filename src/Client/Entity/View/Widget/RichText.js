'use strict';

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
        if(this.isMarkdown) {
            this.namedElements.editor.value = this.toView(this.model.value, 'markdown');
            this.namedElements.preview.innerHTML = this.toView(this.model.value, 'html');
        } else {
            this.namedElements.editor.innerHTML = this.toView(this.model.value, 'html');
        }
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
     * Clears the selection
     */
    clearSelection() {
        this.getSelection().removeAllRanges();
    }

    /**
     * Gets the selection
     *
     * @return {Selection} Selection
     */
    getSelection() {
        let selection = window.getSelection();

        if(this.isMarkdown) {
            let range = new Range();
            let editor = this.namedElements.editor;
            let preview = this.namedElements.preview;

            let marker = `|selection-${Date.now()}|`;
            let text = editor.value.substring(editor.selectionStart, editor.selectionEnd);
            let before = editor.value.substring(0, editor.selectionStart);
            let after = editor.value.substring(editor.selectionEnd);
            let html = HashBrown.Service.MarkdownService.toHtml(before + marker + text + marker + after);

            preview.innerHTML = html;

            let walker = document.createTreeWalker(preview, NodeFilter.SHOW_TEXT, null, false);
            let startOffset = -1;
            let startContainer = null;
            let endOffset = -1;
            let endContainer = null;

            while(walker.nextNode()) {
                while(walker.currentNode.textContent.indexOf(marker) > -1) {
                    let offset = walker.currentNode.textContent.indexOf(marker);
                    let container = walker.currentNode;

                    container.textContent = container.textContent.substring(0, offset) + container.textContent.substring(offset + marker.length);

                    if(startOffset < 0) {
                        startOffset = offset;
                        startContainer = container;

                    } else {
                        endOffset = offset;
                        endContainer = container;

                    }
                }
            }
            
            if(startOffset < 0 || endOffset < 0) {
                throw new Error('Invalid selection');
            }

            range.setStart(startContainer, startOffset);
            range.setEnd(endContainer, endOffset);

            selection.removeAllRanges();
            selection.addRange(range);
        }

        return selection;
    }

    /**
     * Gets all ranges of the selection
     *
     * @return {Array} Ranges
     */
    getSelectionRanges() {
        let selection = this.getSelection();
        let totalRange = selection.getRangeAt(0);
        let container = totalRange.commonAncestorContainer;
        let ranges = [];

        // This is a single node selection
        if(container.childNodes.length < 1) {
            ranges.push(totalRange);

        // This is a multiple node selection
        } else {
            let walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
            let nodes = [];

            while(walker.nextNode()) {
                let node = walker.currentNode;
                
                if(selection.containsNode(node)) {
                    nodes.push(node);
                }
            }

            for(let i = 0; i < nodes.length; i++) {
                let node = nodes[i];
                let range = document.createRange();

                // First range, use start offset and fill to end
                if(i < 1) {
                    range.setStart(node, totalRange.startOffset);
                    range.setEnd(node, node.length);

                // Ranges in the middle, fill both start and end
                } else if(i < nodes.length - 1) {
                    range.setStart(node, 0);
                    range.setEnd(node, node.length);

                // Last range, fill to start and use end offset
                } else {
                    range.setStart(node, 0);
                    range.setEnd(node, totalRange.endOffset);
                
                }

                ranges.push(range);
            }
        }

        return ranges;
    }

    /**
     * Sets the style of the selection element
     *
     * @param {Function} callback
     */
    modifySelection(callback) {
        let ranges = this.getSelectionRanges();

        for(let range of ranges) {
            let node = range.startContainer;
            let element = range.commonAncestorContainer;

            while(element instanceof Text) {
                element = element.parentElement;
            }

            if(
                element === this.namedElements.editor ||
                element === this.namedElements.preview
            ) {
                element = null;
            }

            callback(range, node, element);
        }
    }
    
    /**
     * Removes an element while keeping its children
     *
     * @param {HTMLElement} element
     */
    removeParentElement(element) {
        if(!element) { return; }

        while(element.firstChild) {
            element.parentElement.insertBefore(element.firstChild, element);
        }

        element.parentElement.removeChild(element);
    }

    /**
     * Changes the tag of an element
     *
     * @param {HTMLElement} element
     * @param {String} tagName
     *
     * @return {HTMLElement} New element
     */
    setElementTag(element, tagName) {
        let oldTag = element.tagName.toLowerCase();
        let newTag = tagName.toLowerCase();
            
        if(oldTag === newTag) { return element; }
        
        let newElement = document.createElement(newTag);

        while(element.firstChild) {
            newElement.appendChild(element.firstChild);
        }

        for(let i = element.attributes.length - 1; i >= 0; --i) {
            newElement.attributes.setNamedItem(element.attributes[i].cloneNode());
        }

        element.parentNode.replaceChild(newElement, element);

        return newElement;
    }

    /**
     * Event: Change style
     *
     * @param {String} property
     * @param {String} value
     */
    onChangeStyle(property, value) {
        this.modifySelection((range, node, element) => {
            if(!element) {
                element = document.createElement('span');

                range.surroundContents(element);
            }

            element.style[property] = value;
        });
        
        this.onChange();
    }

    /**
     * Event: Toggle style
     */
    onToggleStyle(property, value) {
        this.modifySelection((range, node, element) => {
            if(!element || element.tagName.toLowerCase() !== 'span') {
                element = document.createElement('span');

                range.surroundContents(element);
            }
            
            if(element.style[property] !== value) {
                element.style[property] = value;
            } else {
                element.style[property] = null;
            }
        });
        
        this.onChange();
    }

    /**
     * Event: Toggle list
     */
    onToggleList(newTagName) {
        let parentElement = null;
        let items = {};
        
        this.modifySelection((range, node, element) => {
            if(
                !element ||
                (
                    element.tagName.toLowerCase() !== 'p' &&
                    element.tagName.toLowerCase() !== 'li'
                )
            ) { return; }
           
            parentElement = element.parentElement;

            items[element.textContent] = element;
        });

        items = Object.values(items);

        if(items.length < 1) { return; }

        let oldTagName = parentElement ? parentElement.tagName.toLowerCase() : '';
           
        console.log(parentElement, items);

        // Clear list
        if(oldTagName === newTagName) {
            while(parentElement.firstChild) {
                let item = parentElement.firstChild;
                
                if(item instanceof HTMLElement === false) {
                    parentElement.removeChild(item);

                } else {
                    parentElement.parentElement.insertBefore(item, parentElement);

                    this.setElementTag(item, 'p');

                }
            }

            parentElement.parentElement.removeChild(parentElement);
        
        // Change list
        } else if(oldTagName === 'ul' || oldTagName === 'ol') {
            parentElement = this.setElementTag(parentElement, newTagName);
        
            for(let item of items) {
                if(item instanceof HTMLElement === false) {
                    parentElement.removeChild(item);

                } else {
                    parentElement.appendChild(item);

                    this.setElementTag(item, 'li');
                
                }
            }
        
        // Create list
        } else {
            let newParentElement = document.createElement(newTagName);

            parentElement.insertBefore(newParentElement, items[0]);

            for(let item of items) {
                if(item instanceof HTMLElement === false) {
                    parentElement.removeChild(item);

                } else {
                    newParentElement.appendChild(item);

                    this.setElementTag(item, 'li');

                }
            }
        }
        
        this.onChange();
    }

    /**
     * Event: Change element
     */
    onChangeElement(tagName) {
        this.modifySelection((range, node, element) => {
            if(!element) {
                element = document.createElement(tagName);

                range.surroundContents(element);
            
            } else {
                this.setElementTag(element, tagName);
            
            }
        });
        
        this.onChange();
    }
    
    /**
     * Event: Toggle element
     */
    onToggleElement(tagName, isActive) {
        let children = [];

        this.modifySelection((range, node, element) => {
            if(isActive === undefined) {
                isActive = element && element.tagName.toLowerCase() === tagName;
            }

            if(isActive) {
                this.removeParentElement(element);
                
            } else {
                element = document.createElement(tagName);
                    
                range.surroundContents(element);
            }
        });
        
        this.onChange();
    }
    
    /**
     * Event: Toggle container element
     */
    onToggleContainerElement(tagName, isActive) {
        let children = [];

        this.modifySelection((range, node, element) => {
            if(element) {
                children.push(element);
            } else {
                children.push(node);
            }
        });

        if(children.length < 1) { return; }

        let container = children[0].parentElement;

        // Determine toggle state
        if(isActive === undefined) {
            isActive = container.tagName.toLowerCase() !== tagName;
        }

        // Create container
        if(container.tagName.toLowerCase() !== tagName && isActive) {
            container = document.createElement(tagName);
            children[0].parentElement.insertBefore(container, children[0]);

            for(let child of children) {
                container.appendChild(child);
            }
        
        // Remove container
        } else if(container.tagName.toLowerCase() === tagName && !isActive) {
            while(container.firstChild) {
                container.parentElement.insertBefore(container.firstChild, container);
            }
        
            container.parentElement.removeChild(container);
        }
        
        this.onChange();
    }

    /**
     * Event: On remove format
     */
    onRemoveFormat() {
        let selection = this.getSelection();
        let range = selection.getRangeAt(0);
        let node = document.createTextNode(selection.toString());

        range.deleteContents();
        range.insertNode(node);

        node.parentElement.normalize();
        
        this.onChange();
    }

    /**
     * Event: Toggle preview
     */
    onTogglePreview() {
        this.state.isPreviewActive = !this.state.isPreviewActive;

        this.render();
    }

    /**
     * Event: Create link
     */
    onCreateLink() {
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
