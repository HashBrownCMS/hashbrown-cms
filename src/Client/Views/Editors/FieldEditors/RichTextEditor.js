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
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */
class RichTextEditor extends HashBrown.Views.Editors.FieldEditors.FieldEditor {
    constructor(params) {
        super(params);

        // Sanity check of value
        if(typeof this.value !== 'string') {
            this.value = this.value || '';
        }

        // Make sure the string is HTML
        try {
            this.value = marked(this.value);
        } catch(e) {
            // Catch this silly exception that marked does sometimes
        }
        
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
        return [
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'}, 'Disable markdown'),
                _.div({class: 'editor__field__value'},
                    new HashBrown.Views.Widgets.Input({
                        type: 'checkbox',
                        tooltip: 'Hides the markdown tab if enabled',
                        value: config.isMarkdownDisabled || false,
                        onChange: (newValue) => { config.isMarkdownDisabled = newValue; }
                    }).$element
                )
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
        let mediaBrowser = new HashBrown.Views.Modals.MediaBrowser();

        mediaBrowser.on('select', (id) => {
            HashBrown.Helpers.MediaHelper.getMediaById(id)
            .then((media) => {
                let html = '';

                if(media.isImage()) {
                    html = '<img data-id="' + id + '" alt="' + media.name + '" src="' + media.url + '">';
                } else if(media.isVideo()) {
                    html = '<video data-id="' + id + '" alt="' + media.name + '" src="' + media.url + '">';
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
                        this.markdown.replaceSelection(toMarkdown(html), 'end');
                        break;
                }
            })
            .catch(UI.errorModal);
        });
    }
    
    /**
     * Gets the tab content
     *
     * @returns {HTMLElement} Tab content
     */
    getTabContent() {
        return this.element.querySelector('.field-editor--rich-text__tab__content');
    }

    /**
     * Initialises the HTML editor
     */
    initHtmlEditor() {
        setTimeout(() => {
            // Kepp reference to editor
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
            this.html.getDoc().setValue(this.value);
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
                value: toMarkdown(this.value)
            });

            // Change event
            this.markdown.on('change', () => {
                this.onChange(marked(this.markdown.getDoc().getValue()));
            });

            // Set value initially
            this.silentChange = true;
            this.markdown.getDoc().setValue(toMarkdown(this.value));
        }, 1);
    }

    /**
     * Initialises the WYSIWYG editor
     */
    initWYSIWYGEditor() {
        this.wysiwyg = CKEDITOR.replace(
            this.getTabContent(),
            {
                removePlugins: 'contextmenu,liststyle,tabletools',
                allowedContent: true,
                height: 400,
                toolbarGroups: [
                    { name: 'styles' },
                    { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
                    { name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
                    { name: 'links' },
                    { name: 'insert' },
                    { name: 'forms' },
                    { name: 'tools' },
                    { name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
                    { name: 'others' },
                ],
           
                extraPlugins: 'justify,divarea',

                removeButtons: 'Image,Styles,Underline,Subscript,Superscript,Source,SpecialChar,HorizontalRule,Maximize,Table',

                removeDialogTabs: 'image:advanced;link:advanced'
            }
        );

        this.wysiwyg.on('change', () => {
            this.onChange(this.wysiwyg.getData());
        });

        this.wysiwyg.on('instanceReady', () => {
            // Strips the style information
            let stripStyle = (element) => {
                delete element.attributes.style;
            };

            // Filtering rules
            this.wysiwyg.dataProcessor.dataFilter.addRules({
                elements: {
                    // Strip styling from these elements
                    p: stripStyle,
                    h1: stripStyle,
                    h2: stripStyle,
                    h3: stripStyle,
                    h4: stripStyle,
                    h5: stripStyle,
                    h6: stripStyle,
                    span: stripStyle,
                    div: stripStyle,
                    section: stripStyle,
                    hr: stripStyle,
                    header: stripStyle,
                    aside: stripStyle,
                    footer: stripStyle,
                    ul: stripStyle,
                    li: stripStyle,
                    blockquote: stripStyle,

                    // Refactor image src url to fit MediaController
                    img: (element) => {
                        stripStyle(element);

                        // Fetch from data attribute
                        if(element.attributes['data-id']) {
                            element.attributes.src = '/media/' + HashBrown.Helpers.ProjectHelper.currentProject + '/' + HashBrown.Helpers.ProjectHelper.currentEnvironment + '/' + element.attributes['data-id'];
                        
                        // Failing that, use regex
                        } else {
                            element.attributes.src = element.attributes.src.replace(/.+media\/([0-9a-z]+)\/.+/g, '/media/' + HashBrown.Helpers.ProjectHelper.currentProject + '/' + HashBrown.Helpers.ProjectHelper.currentEnvironment + '/$1');
                        
                        }
                        
                    },
                    
                    // Refactor video src url to fit MediaController
                    video: (element) => {
                        stripStyle(element);

                        // Fetch from data attribute
                        if(element.attributes['data-id']) {
                            element.attributes.src = '/media/' + HashBrown.Helpers.ProjectHelper.currentProject + '/' + HashBrown.Helpers.ProjectHelper.currentEnvironment + '/' + element.attributes['data-id'];
                        
                        // Failing that, use regex
                        } else {
                            element.attributes.src = element.attributes.src.replace(/.+media\/([0-9a-z]+)\/.+/g, '/media/' + HashBrown.Helpers.ProjectHelper.currentProject + '/' + HashBrown.Helpers.ProjectHelper.currentEnvironment + '/$1');
                        
                        }
                        
                    }
                }
            });

            // Set value initially
            this.silentChange = true;
            this.wysiwyg.setData(this.value);
        });
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

        return _.div({class: 'field-editor field-editor--rich-text', title: this.description || ''},
            _.div({class: 'field-editor--rich-text__header'},
                _.each({wysiwyg: 'Visual', markdown: 'Markdown', html: 'HTML'}, (alias, label) => {
                    return _.button({class: (activeView === alias ? 'active ' : '') + 'field-editor--rich-text__header__tab'}, label)
                        .click(() => { this.onClickTab(alias); })
                }),
                _.button({class: 'field-editor--rich-text__header__add-media'},
                    'Add media'
                ).click(() => { this.onClickInsertMedia(); })
            ),
            _.div({class: 'field-editor--rich-text__body'},
                _.if(activeView === 'wysiwyg',
                    _.div({class: 'field-editor--rich-text__tab wysiwyg'},
                        _.div({class: 'field-editor--rich-text__tab__content', 'contenteditable': true})
                    )
                ),
                _.if(activeView === 'markdown',
                    _.div({class: 'field-editor--rich-text__tab markdown'},
                        _.textarea({class: 'field-editor--rich-text__tab__content'})
                    )
                ),
                _.if(activeView === 'html',
                    _.div({class: 'field-editor--rich-text__tab html'},
                        _.textarea({class: 'field-editor--rich-text__tab__content'})
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
