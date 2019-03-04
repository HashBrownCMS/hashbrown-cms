'use strict';

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
class MediaReferenceEditor extends HashBrown.Views.Editors.FieldEditors.FieldEditor {
    constructor(params) {
        super(params);

        this.fetch();
    }

    /**
     * Renders this editor
     */
    template() {
        let media = HashBrown.Helpers.MediaHelper.getMediaByIdSync(this.value);

        return _.div({class: 'field-editor field-editor--media-reference', title: this.description || ''},
            _.button({class: 'field-editor--media-reference__pick'},
                _.do(()=> {
                    if(!media) { return _.div({class: 'field-editor--media-reference__empty'}); }
            
                    if(media.isAudio()) {
                        return _.div({class: 'field-editor--media-reference__preview fa fa-file-audio-o'});
                    }

                    if(media.isVideo()) {
                        return _.div({class: 'field-editor--media-reference__preview fa fa-file-video-o'});
                    }

                    if(media.isImage()) {
                        return _.img({class: 'field-editor--media-reference__preview', src: '/media/' + HashBrown.Helpers.ProjectHelper.currentProject + '/' + HashBrown.Helpers.ProjectHelper.currentEnvironment + '/' + media.id + '?width=200'});
                    }
                })
            ).click(() => {
                new HashBrown.Views.Modals.MediaBrowser({
                    value: this.value
                })
                .on('select', (id) => {
                    this.value = id;

                    this.trigger('change', this.value);

                    this.fetch();
                });
            }),
            _.div({class: 'field-editor--media-reference__footer'},
                _.label({class: 'field-editor--media-reference__name'}, media ? media.name : ''),
                _.button({class: 'field-editor--media-reference__remove', title: 'Clear the Media selection'})
                    .click(() => {
                        this.value = null;

                        this.trigger('change', this.value);

                        this.fetch();
                    })
            )
        );
    }
}

module.exports = MediaReferenceEditor;
