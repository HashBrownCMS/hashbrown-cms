'use strict';

/**
 * A rich text editor
 */
class RichTextEditor extends View {
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
     * @param {String} source
     */
    onChange(value) {
        if(this.value == value) { return; }

        this.value = value;

        this.trigger('change', this.value);
    }

    /**
     * Event: On click tab
     *
     * @param {String} source
     */
    onClickTab(source) {
        switch(source) {
            case 'wysiwyg':
                this.wysiwyg.setData(this.value);
                break;
            
            case 'html':
                this.html.getDoc().setValue(this.value);
                break;
            
            case 'markdown':
                this.markdown.getDoc().setValue(toMarkdown(this.value));
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
                let html = '<img data-id="' + id + '" alt="' + media.name + '" src="/' + media.url + '">';

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
                _.each(['wysiwyg', 'markdown', 'html'], (i, label) => {
                    return _.li({class: activeView == label ? 'active' : ''},
                        _.a({'data-toggle': 'tab', href: '#' + this.guid + '-' + label},
                            label
                        ).click(() => { this.onClickTab(label); })
                    );
                }),
                _.button({class: 'btn btn-primary btn-insert-media'},
                    _.span({class: 'fa fa-file-image-o'})                                        
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

                removeButtons: 'Image,Anchor,Styles,Underline,Subscript,Superscript,Source,SpecialChar,HorizontalRule,Maximize,Table',

                format_tags: 'p;h1;h2;h3;h4;h5;h6;pre',

                removeDialogTabs: 'image:advanced;link:advanced'
            }
        );

        this.wysiwyg.on('change', () => {
            this.onChange(this.wysiwyg.getData());
        });

        this.wysiwyg.on('instanceReady', () => {
            // Filtering rules
            this.wysiwyg.dataProcessor.dataFilter.addRules({
                elements: {
                    // Refactor image src url to fit MediaController
                    img: (element) => {
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

            // Set data
            if(activeView == 'wysiwyg') {
                this.wysiwyg.setData(this.value);
            }
        });
    }
}

module.exports = RichTextEditor;
