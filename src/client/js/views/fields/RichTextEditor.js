'use strict';

const FieldEditor = require('./FieldEditor');

/**
 * A rich text editor
 */
class RichTextEditor extends FieldEditor {
    constructor(params) {
        super(params);

        // Sanity check of value
        this.value = this.value || '';

        // Make sure convert is HTML
        this.value = marked(this.value);

        this.init();
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

        switch(source) {
            case 'wysiwyg':
                this.wysiwyg.setData(this.value);
                break;
            
            case 'html':
                this.html.getDoc().setValue(this.value);

                setTimeout(() => {
                    this.html.refresh();
                }, 1);
                break;
            
            case 'markdown':
                this.markdown.getDoc().setValue(toMarkdown(this.value));
                
                setTimeout(() => {
                    this.markdown.refresh();
                }, 1);
                break;
        }
        
        document.cookie = 'rteview = ' + source;
    }

    /**
     * Event: Click insert media
     */
    onClickInsertMedia() {
        let mediaBrowser = new MediaBrowser();

        mediaBrowser.on('select', (id) => {
            MediaHelper.getMediaById(id)
            .then((media) => {
                let html = '';

                if(media.isImage()) {
                    html = '<img data-id="' + id + '" alt="' + media.name + '" src="/' + media.url + '">';
                } else if(media.isVideo()) {
                    html = '<video data-id="' + id + '" alt="' + media.name + '" src="/' + media.url + '">';
                }

                let source = getCookie('rteview');

                switch(source) {
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
            .catch(errorModal);
        });
    }

    render() {
        let $wysiwyg;
        let $markdown;
        let $html;
       
        let activeView = getCookie('rteview') || 'wysiwyg';

        // Main element
        this.$element = _.div({class: 'field-editor rich-text-editor panel panel-default'},
            _.ul({class: 'nav nav-tabs'},
                _.each({wysiwyg: 'Visual', markdown: 'Markdown', html: 'HTML'}, (alias, label) => {
                    return _.li({class: activeView == alias ? 'active' : ''},
                        _.a({'data-toggle': 'tab', href: '#' + this.guid + '-' + alias},
                            label
                        ).click(() => { this.onClickTab(alias); })
                    );
                }),
                _.button({class: 'btn btn-primary btn-insert-media'},
                    'Add media'
                ).click(() => { this.onClickInsertMedia(); })
            ),
            _.div({class: 'tab-content'},
                _.div({id: this.guid + '-wysiwyg', class: 'tab-pane wysiwyg ' + (activeView == 'wysiwyg' ? 'active' : '')},
                    $wysiwyg = _.div({'contenteditable': true})
                ),
                _.div({id: this.guid + '-markdown', class: 'tab-pane markdown ' + (activeView == 'markdown' ? 'active' : '')},
                    $markdown = _.textarea({})
                ),
                _.div({id: this.guid + '-html', class: 'tab-pane html ' + (activeView == 'html' ? 'active' : '')},
                    $html = _.textarea({})
                )
            )
        );
        
        // Init HTML editor
        setTimeout(() => {
            this.html = CodeMirror.fromTextArea($html[0], {
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

            this.html.on('change', () => {
                this.onChange(this.html.getDoc().getValue());
            });
            
            // Set value
            if(activeView == 'html') {
                this.silentChange = true;
                this.html.getDoc().setValue(this.value);
            }
        }, 1);

        // Init markdown editor
        setTimeout(() => {
            this.markdown = CodeMirror.fromTextArea($markdown[0], {
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

            this.markdown.on('change', () => {
                this.onChange(marked(this.markdown.getDoc().getValue()));
            });

            // Set value
            if(activeView == 'markdown') {
                this.silentChange = true;
                this.markdown.getDoc().setValue(toMarkdown(this.value));
            }
        }, 1);

        

        // Init WYSIWYG editor
        this.wysiwyg = CKEDITOR.replace(
            $wysiwyg[0],
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
                            element.attributes.src = '/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + element.attributes['data-id'];
                        
                        // Failing that, use regex
                        } else {
                            element.attributes.src = element.attributes.src.replace(/.+media\/([0-9a-z]{40})\/.+/g, '/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/$1');
                        
                        }
                        
                    },
                    
                    // Refactor video src url to fit MediaController
                    video: (element) => {
                        stripStyle(element);

                        // Fetch from data attribute
                        if(element.attributes['data-id']) {
                            element.attributes.src = '/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + element.attributes['data-id'];
                        
                        // Failing that, use regex
                        } else {
                            element.attributes.src = element.attributes.src.replace(/.+media\/([0-9a-z]{40})\/.+/g, '/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/$1');
                        
                        }
                        
                    }
                }
            });

            // Set value
            if(activeView == 'wysiwyg') {
                this.silentChange = true;
                this.wysiwyg.setData(this.value);
            }
        });
    }
}

module.exports = RichTextEditor;
