/**
 * A standalone WYSIWYG editor
 *
 * @memberof HashBrown.Client.Views.Editors
 */
class WYSIWYGEditor extends Crisp.View {
    constructor(params) {
        super(params);

        this.fetch();
    }

    /**
     * Event: Value changed
     */
    onChange() {
        this.value = this.toValue(this.$editor.html());

        this.trigger('change', this.value);
    }

    /**
     * Insert HTML
     *
     * @param {String} html
     */
    insertHtml(html) {
        if(!html) { return; }

        this.$editor[0].innerHTML += this.toView(html);

        this.onChange();
    };

    /**
     * Updates the paragraph picker and selection tag
     */
    updateElementTag () {
        let selection = window.getSelection();

        if(!selection) { return; }

        let textNode = selection.anchorNode;

        if(!textNode) { return; }
        
        let parentElement = textNode.parentElement;
       
        if(!parentElement) { return; }
        
        let parentElementTagName = parentElement.tagName.toLowerCase();

        // If the parent tag is not a heading or a paragraph, default to paragraph
        if(!this.paragraphPicker.options[parentElementTagName]) {
            parentElementTagName = 'p';
        }

        this.paragraphPicker.setValueSilently(parentElementTagName);
    }

    /**
     * Converts HTML to view format, replacing media references
     *
     * @param {String} html
     *
     * @return {String} HTML
     */
    toView(html) {
        this._parserCache = {};
        
        if(!html) { return ''; }

        return html.replace(/src=".*media\/([a-z0-9]+)\/([^"]+)"/g, (original, id, filename) => {
            this._parserCache[id] = filename;
        
            return 'src="/media/' + HashBrown.Context.projectId + '/' + HashBrown.Context.environment + '/' + id + '"';
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
        
        // Replace media references
        html = html.replace(new RegExp('src="/media/' + HashBrown.Context.projectId + '/' + HashBrown.Context.environment + '/([a-z0-9]+)"', 'g'), (original, id) => {
            let filename = this._parserCache ? this._parserCache[id] : null;

            if(!filename) { return original; }
        
            return 'src="/media/' + id + '/' + filename + '"';
        });

        // Replace empty divs with pararaphs
        html = html.replace(/<div>/g, '<p>').replace(/<\/div>/g, '</p>');

        return html;
    }

    /**
     * Renders this view
     */
    template() {
        return _.div({class: 'editor editor--wysiwyg'},
            this.$toolbar = _.div({class: 'editor--wysiwyg__toolbar widget-group'},
                this.paragraphPicker = new HashBrown.Views.Widgets.Dropdown({
                    value: 'p',
                    options: {
                        p: 'Paragraph',
                        h1: 'Heading 1',
                        h2: 'Heading 2',
                        h3: 'Heading 3',
                        h4: 'Heading 4',
                        h5: 'Heading 5',
                        h6: 'Heading 6'
                    },
                    onChange: (newValue) => {
                        document.execCommand('heading', false, newValue);
                        this.$editor.focus();
                        this.onChange();
                    }
                }),
                _.button({class: 'widget widget--button standard small fa fa-bold', title: 'Bold'})
                    .click(() => {
                        document.execCommand('bold');
                        this.onChange();
                    }),
                _.button({class: 'widget widget--button standard small fa fa-italic', title: 'Italic'})
                    .click(() => {
                        document.execCommand('italic');
                        this.onChange();
                    }),
                _.button({class: 'widget widget--button standard small fa fa-underline', title: 'Underline'})
                    .click(() => {
                        document.execCommand('underline');
                        this.onChange();
                    }),
                _.button({class: 'widget widget--button standard small fa fa-remove', title: 'Remove formatting'})
                    .click(() => {
                        document.execCommand('removeFormat');
                        document.execCommand('unlink');
                        this.onChange();
                    }),
                _.button({class: 'widget widget--button standard small fa fa-link', title: 'Create link'})
                    .click(() => {
                        let selection = window.getSelection();
                        let anchorOffset = selection.anchorOffset;
                        let focusOffset = selection.focusOffset;
                        let anchorNode = selection.anchorNode;
                        let url = anchorNode.parentElement.getAttribute('href');
                        let range = selection.getRangeAt(0);
                        let text = selection.toString();
                        let newTab = false;

                        if(Math.abs(anchorOffset - focusOffset) < 1) {
                            return UI.messageModal('Create link', 'Please select some text first');
                        }

                        let modal = UI.messageModal(
                            'Create link for selection "' + text + '"',
                            _.div({class: 'widget-group'},
                                _.div({class: 'widget widget--label'}, 'URL'),
                                new HashBrown.Views.Widgets.Input({
                                    type: 'text',
                                    value: url,
                                    onChange: (newValue) => { url = newValue; }
                                }),
                                new HashBrown.Views.Widgets.Input({
                                    type: 'checkbox',
                                    placeholder: 'New tab',
                                    onChange: (newValue) => { newTab = newValue; }
                                })
                            ),
                            () => {
                                if(!url) { return; }

                                selection = window.getSelection();
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
                            }
                        );

                        modal.$element.find('input:first-of-type').focus();
                    })
            ),
            this.$editor = _.div({class: 'editor--wysiwyg__editor', contenteditable: true}, this.toView(this.value))
                .on('input', (e) => { this.onChange(); })
                .on('click', (e) => { this.updateElementTag(); })
                .on('keyup', (e) => { this.updateElementTag(); })
        )
    }
}

module.exports = WYSIWYGEditor;
