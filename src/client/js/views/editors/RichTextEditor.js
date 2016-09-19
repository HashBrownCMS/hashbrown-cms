'use strict';

// Override CKEditor image plugin
CKEDITOR.plugins.registered.image.init = (editor) => {
    // Button UI
    editor.ui.addButton && editor.ui.addButton("Image", {
        label: editor.lang.common.image,
        command: "image",
        toolbar: "insert,10"
    });

    // Add menu item
    editor.addMenuItems && editor.addMenuItems({
        image: {
            label: editor.lang.image.menu,
            command: "image",
            group: "image"
        }
    });

    // Handler
    editor.addCommand('image', {
        modes: { wysiwyg: 1, markdown: 1 },
        exec: (editor) => {
            for(let rte of ViewHelper.getAll('RichTextEditor')) {
                if(rte.editor == editor) {
                    rte.onClickInsertMedia();
                    break;
                }
            }
        }
    });
};

/**
 * A rich text editor
 */
class RichTextEditor extends View {
    constructor(params) {
        super(params);

        this.init();
    }

    /**
     * Event: Change input
     */
    onChange() {
        let data = this.editor.getData();
        this.value = toMarkdown(data);
        
        this.trigger('change', this.value);
    }

    /**
     * Event: Click insert media
     */
    onClickInsertMedia() {
        let mediaBrowser = new MediaBrowser();

        mediaBrowser.on('select', (id) => {
            MediaHelper.getMediaById(id)
            .then((media) => {
                let html = '<img alt="' + media.name + '" src="/' + media.url + '">';

                this.editor.insertHtml(html);

                this.onChange();
            })
            .catch(errorModal);
        });
    }


    render() {
        let $editable;
        
        // Main element
        this.$element = _.div({class: 'field-editor rich-text-editor panel panel-default'},
            $editable = _.div({'contenteditable': true})
        );

        this.editor = CKEDITOR.replace(
            $editable[0],
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

                extraPlugins: 'markdown',

                removeButtons: 'Anchor,Styles,Underline,Subscript,Superscript,Source,SpecialChar,HorizontalRule,Maximize,Table',

                format_tags: 'p;h1;h2;h3;pre',

                removeDialogTabs: 'image:advanced;link:advanced'
            }
        );

        this.editor.on('change', () => {
            this.onChange();
        });

        // Init editor instance
        this.editor.on('instanceReady', () => {

            // Filtering rules
            this.editor.dataProcessor.dataFilter.addRules({
                elements: {
                    // Refactor image src url to fit MediaController
                    img: (element) => {
                        element.attributes.src = element.attributes.src.replace(/\/media\/([0-9a-z]{40})\/.+/g, '/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/$1/');
                    }
                }
            });

            // Insert text
            this.editor.setData(marked(this.value));
        });
    }
}

module.exports = RichTextEditor;
