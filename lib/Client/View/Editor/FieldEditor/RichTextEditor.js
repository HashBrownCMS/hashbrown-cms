'use strict';

/**
 * A rich text editor
 *
 * @description Example:
 * <pre>
 * {
 *     "myRichText": {
 *         "label": "My rich text",
 *         "tabId": "content",
 *         "schemaId": "richText"
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.View.Editor.FieldEditor
 */
class RichTextEditor extends HashBrown.View.Editor.FieldEditor.FieldEditor {
    constructor(params) {
        super(params);

        // Sanity check of value
        if(typeof this.value !== 'string') {
            this.value = this.value || '';
        }

        // Make sure the string is HTML
        this.value = HashBrown.Service.MarkdownService.toHtml(this.value);
        
        this.fetch();
    }
    
    /**
     * Renders the config editor
     *
     * @param {Object} config
     *
     * @returns {HTMLElement} Element
     */
    static renderConfigEditor(config) {
        if(!config.wysiwygToolbar) { config.wysiwygToolbar = {}; }

        return [
            this.field(
                'Disable media',
                new HashBrown.View.Widget.Input({
                    type: 'checkbox',
                    tooltip: 'Hides the media picker if enabled',
                    value: config.isMediaDisabled || false,
                    onChange: (newValue) => { config.isMediaDisabled = newValue; }
                })
            ),
            this.field(
                'Disable markdown',
                new HashBrown.View.Widget.Input({
                    type: 'checkbox',
                    tooltip: 'Hides the markdown tab if enabled',
                    value: config.isMarkdownDisabled || false,
                    onChange: (newValue) => { config.isMarkdownDisabled = newValue; }
                })
            ),
            this.field(
                'Disable HTML',
                new HashBrown.View.Widget.Input({
                    type: 'checkbox',
                    tooltip: 'Hides the HTML tab if enabled',
                    value: config.isMarkdownDisabled || false,
                    onChange: (newValue) => { config.isHtmlDisabled = newValue; }
                })
            ),
            this.field(
                {
                    label: 'WYSIWYG',
                    isCollapsible: true,
                    isCollapsed: true
                },
                _.each({ paragraphs: 'Paragraphs', style: 'Style', lists: 'Lists', positioning: 'Positioning'  }, (categoryKey, categoryLabel) => {
                    return this.field(
                        {
                            label: categoryLabel,
                            isCollapsible: true,
                            isCollapsed: true
                        },
                        _.each(HashBrown.View.Editor.WYSIWYGEditor.getToolbarElements(categoryKey), (key, label) => {
                            return this.field(
                                label,
                                new HashBrown.View.Widget.Input({
                                    type: 'checkbox',
                                    value: config.wysiwygToolbar[key] !== false,
                                    onChange: (newValue) => { config.wysiwygToolbar[key] = newValue; }
                                })
                            );
                        })
                    );
                })
            )
        ];
    }

    /**
     * Event: Change input
     *
     * @param {String} value
     */
    onChange(value) {
        value = value || '';

        this.value = value;

        if(this.silentChange === true) {
            this.silentChange = false;

            this.trigger('silentchange', this.value);
        
        } else {
            this.trigger('change', this.value);

        }
    }

    /**
     * Event: On click tab
     *
     * @param {String} source
     */
    onClickTab(source) {
        this.silentChange = true;

        this.activeView = source;

        this.fetch();
    }

    /**
     * Event: Click insert media
     */
    onClickInsertMedia() {
        let mediaBrowser = new HashBrown.View.Modal.MediaBrowser();

        mediaBrowser.on('select', async (id) => {
            let media = await HashBrown.Service.MediaService.getMediaById(id);
            
            if(!media) { return; }

            let html = '';

            if(media.isImage()) {
                html = '<img alt="' + media.name + '" src="/media/' + id + '/' + media.name + '">';
            } else if(media.isVideo()) {
                html = '<video alt="' + media.name + '" src="/media/' + id + '/' + media.name + '">';
            }

            let activeView = this.activeView || 'wysiwyg';

            switch(activeView) {
                case 'wysiwyg':
                    this.wysiwyg.insertHtml(html);
                    break;
                
                case 'html':
                    this.html.replaceSelection(html, 'end');
                    break;
                
                case 'markdown':
                    this.markdown.replaceSelection(HashBrown.Service.MarkdownService.toMarkdown(html), 'end');
                    break;
            }
        });
    }
    
    /**
     * Gets the tab content
     *
     * @returns {HTMLElement} Tab content
     */
    getTabContent() {
        return this.element.querySelector('.field-editor--rich-text__body__tab__content');
    }

    /**
     * Initialises the HTML editor
     */
    initHtmlEditor() {
        setTimeout(() => {
            // Keep reference to editor
            this.html = CodeMirror.fromTextArea(this.getTabContent(), {
                lineNumbers: false,
                mode: {
                    name: 'xml'
                },
                viewportMargin: Infinity,
                tabSize: 4,
                indentUnit: 4,
                indentWithTabs: true,
                theme: 'default',
                value: this.value
            });

            // Change event
            this.html.on('change', () => {
                this.onChange(this.html.getDoc().getValue());
            });

            // Set value initially
            this.silentChange = true;
            this.html.getDoc().setValue(this.value || '');
        }, 1);
    }
    
    /**
     * Initialises the markdown editor
     */
    initMarkdownEditor() {
        setTimeout(() => {
            // Keep reference to editor
            this.markdown = CodeMirror.fromTextArea(this.getTabContent(), {
                lineNumbers: false,
                mode: {
                    name: 'markdown'
                },
                viewportMargin: Infinity,
                tabSize: 4,
                indentUnit: 4,
                indentWithTabs: true,
                theme: 'default',
                value: HashBrown.Service.MarkdownService.toMarkdown(this.value)
            });

            // Change event
            this.markdown.on('change', () => {
                this.onChange(HashBrown.Service.MarkdownService.toHtml(this.markdown.getDoc().getValue()));
            });

            // Set value initially
            this.silentChange = true;
            this.markdown.getDoc().setValue(HashBrown.Service.MarkdownService.toMarkdown(this.value || ''));
        }, 1);
    }

    /**
     * Initialises the WYSIWYG editor
     */
    initWYSIWYGEditor() {
        this.wysiwyg = new HashBrown.View.Editor.WYSIWYGEditor({
            value: this.value,
            toolbar: this.config.wysiwygToolbar || {}
        });

        this.wysiwyg.on('change', (newValue) => {
            this.onChange(newValue);
        });
        
        _.replace(this.getTabContent().parentElement, this.wysiwyg.element);
    }

    /**
     * Prerender
     */
    prerender() {
        this.markdown = null;
        this.wysiwyg = null;
        this.html = null;
    }

    /** 
     * Renders this editor
     */
    template() {
        let activeView = this.activeView || 'wysiwyg';

        if((activeView === 'html' && this.config.isHtmlDisabled) || (activeView === 'markdown' && this.config.isMarkdownDisabled)) {
            activeView = 'wysiwyg';
        }

        return _.div({class: 'field-editor field-editor--rich-text'},
            _.div({class: 'field-editor--rich-text__header'},
                _.each({wysiwyg: 'Visual', markdown: 'Markdown', html: 'HTML'}, (alias, label) => {
                    if((alias === 'html' && this.config.isHtmlDisabled) || (alias === 'markdown' && this.config.isMarkdownDisabled)) { return; }

                    return _.button({class: (activeView === alias ? 'active ' : '') + 'field-editor--rich-text__header__tab'}, label)
                        .click(() => { this.onClickTab(alias); })
                }),
                _.if(!this.config.isMediaDisabled,
                    _.button({class: 'field-editor--rich-text__header__add-media'},
                        'Add media'
                    ).click(() => { this.onClickInsertMedia(); })
                )
            ),
            _.div({class: 'field-editor--rich-text__body'},
                _.if(activeView === 'wysiwyg',
                    _.div({class: 'field-editor--rich-text__body__tab wysiwyg'},
                        _.div({class: 'field-editor--rich-text__body__tab__content'})
                    )
                ),
                _.if(activeView === 'markdown',
                    _.div({class: 'field-editor--rich-text__body__tab markdown'},
                        _.textarea({class: 'field-editor--rich-text__body__tab__content'})
                    )
                ),
                _.if(activeView === 'html',
                    _.div({class: 'field-editor--rich-text__body__tab html'},
                        _.textarea({class: 'field-editor--rich-text__body__tab__content'})
                    )
                )
            )
        );
    }
     
    /**
     * Post render
     */
    postrender() {
        super.postrender();
        
        let activeView = this.activeView || 'wysiwyg';
       
        switch(activeView) {
            case 'html':
                this.initHtmlEditor();
                break;

            case 'markdown':
                this.initMarkdownEditor();
                break;

            case 'wysiwyg':
                this.initWYSIWYGEditor();
                break;
        }
    }
}

module.exports = RichTextEditor;
