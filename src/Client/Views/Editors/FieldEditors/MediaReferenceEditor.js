'use strict';

const Media = require('Common/Models/Media');
const MediaHelper = require('Client/Helpers/MediaHelper');
const ProjectHelper = require('Client/Helpers/ProjectHelper');
const MediaBrowser = require('Client/Views/Modals/MediaBrowser');

const FieldEditor = require('./FieldEditor');

/**
 * A picker for referencing Media 
 *
 * @description Example:
 * <pre>
 * {
 *     "myMediaReference": {
 *         "label": "My medie reference",
 *         "tabId": "content",
 *         "schemaId": "mediaReference"
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */
class MediaReferenceEditor extends FieldEditor {
    constructor(params) {
        super(params);

        this.fetch();
    }

    /**
     * Renders this editor
     */
    template() {
        let media = MediaHelper.getMediaByIdSync(this.value);

        return _.div({class: 'editor__field__value editor__field--media-reference', title: this.description || ''},
            _.button({class: 'editor__field--media-reference__pick'},
                _.do(()=> {
                    if(!media) { return _.div({class: 'editor__field--media-reference__empty'}); }
            
                    return [
                        _.if(media.isVideo(),
                            _.video({class: 'editor__field--media-reference__preview', muted: true, autoplay: true, loop: true, src: '/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + media.id})
                        ),
                        _.if(media.isImage(),
                            _.img({class: 'editor__field--media-reference__preview', src: '/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + media.id})
                        )
                    ];
                })
            ).click(() => {
                let mediaBrowser = new MediaBrowser({
                    value: this.value
                });

                mediaBrowser.on('select', (id) => {
                    this.value = id;

                    this.trigger('change', this.value);

                    this.fetch();
                });
            }),
            _.div({class: 'editor__field--media-reference__footer'},
                _.label({class: 'editor__field--media-reference__name'}, media ? media.name : ''),
                _.button({class: 'editor__field--media-reference__remove', title: 'Clear the Media selection'})
                    .click(() => {
                        this.value = null;

                        this.fetch();
                    })
            )
        );
    }
}

module.exports = MediaReferenceEditor;
