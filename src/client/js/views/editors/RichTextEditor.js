'use strict';

/**
 * A rich text editor
 */
class RichTextEditor extends View {
    constructor(params) {
        super(params);

        this.canChange = true;

        this.init();
    }

    /**
     * Event: Change input
     *
     * @param {String} value
     * @param {Object} source
     */
    onChange(value, source) {
        if(!this.canChange || this.value == value) { return; }

        this.canChange = false;

        this.value = value;

        if(source != this.wysiwyg) {
            this.wysiwyg.setData(value);
        }
        
        if(source != this.html) {
            this.html.getDoc().setValue(value);
        }
            
        if(source != this.markdown) {
            this.markdown.getDoc().setValue(toMarkdown(value));
        }
        
        this.trigger('change', this.value);

        setTimeout(() => {
            this.canChange = true;
        }, 1);
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

                // TODO: Conditional logic for which editor is active
                this.wysiwyg.insertHtml(html);

                this.onChange(this.wysiwyg.getData(), this.wysiwyg);
            })
            .catch(errorModal);
        });
    }

    render() {
        let $wysiwyg;
        let $markdown;
        let $html;
        
        // Main element
        this.$element = _.div({class: 'field-editor rich-text-editor panel panel-default'},
            _.ul({class: 'nav nav-tabs'},
                _.li({class: 'active'},
                    _.a({'data-toggle': 'tab', href: '#' + this.guid + '-wysiwyg'},
                        'Wysiwyg'
                    )
                ),
                _.li(
                    _.a({'data-toggle': 'tab', href: '#' + this.guid + '-markdown'},
                        'Markdown'
                    )
                ),
                _.li(
                    _.a({'data-toggle': 'tab', href: '#' + this.guid + '-html'},
                        'HTML'
                    )
                ),
                _.button({class: 'btn btn-primary btn-insert-media'},
                    _.span({class: 'fa fa-file-image-o'})                                        
                ).click(() => { this.onClickInsertMedia(); })
            ),
            _.div({class: 'tab-content'},
                _.div({id: this.guid + '-wysiwyg', class: 'tab-pane active wysiwyg'},
                    $wysiwyg = _.div({'contenteditable': true})
                ),
                _.div({id: this.guid + '-markdown', class: 'tab-pane markdown'},
                    $markdown = _.textarea({})
                ),
                _.div({id: this.guid + '-html', class: 'tab-pane html'},
                    $html = _.textarea({})
                )
            )
        );
        
        // Init HTML editor
        setTimeout(() => {
            this.html = CodeMirror.fromTextArea($html[0], {
                lineNumbers: true,
                mode: {
                    name: 'html'
                },
                viewportMargin: Infinity,
                tabSize: 4,
                indentUnit: 4,
                indentWithTabs: true,
                theme: 'default',
                value: this.value
            });

            this.html.getDoc().setValue(this.value);

            this.html.on('change', () => {
                this.onChange(this.html.getDoc().getValue(), this.html);
            });
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

            this.markdown.getDoc().setValue(toMarkdown(this.value));

            this.markdown.on('change', () => {
                this.onChange(marked(this.markdown.getDoc().getValue()), this.markdown);
            });
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
            this.onChange(this.wysiwyg.getData(), this.wysiwyg);
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

            // Insert text
            this.wysiwyg.setData(this.value || '');
        });
    }
}

module.exports = RichTextEditor;
