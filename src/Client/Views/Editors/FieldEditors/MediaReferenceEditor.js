'use strict';

/**
 * A picker for referencing Media 
 *
 * @description Example:
 * <pre>
 * {
 *     "myMediaReference": {
 *         "label": "My media reference",
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
     * Fetches the model
     */
    async fetch() {
        this.isBroken = false;

        try {
            if(this.value) {
                this.model = await HashBrown.Helpers.MediaHelper.getMediaById(this.value);
            }

        } catch(e) {
            this.isBroken = true;
                
        }
            
        super.fetch();
    }

    /**
     * Event: Click select
     */
    onClickSelect() {
        new HashBrown.Views.Modals.MediaBrowser({
            value: this.value
        })
        .on('select', (id) => {
            this.value = id;

            this.trigger('change', this.value);

            this.fetch();
        });
    }

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'field-editor field-editor--media-reference'},
            _.button({class: 'field-editor--media-reference__pick', title: this.isBroken ? 'The selected media could not be found' : ''},
                _.do(()=> {
                    if(this.isBroken) { return _.div({class: 'field-editor--media-reference__preview fa fa-exclamation-triangle'}); }
                    if(!this.model) { return _.div({class: 'field-editor--media-reference__empty'}); }
            
                    if(this.model.isAudio()) {
                        return _.div({class: 'field-editor--media-reference__preview fa fa-file-audio-o'});
                    }

                    if(this.model.isVideo()) {
                        return _.div({class: 'field-editor--media-reference__preview fa fa-file-video-o'});
                    }

                    if(this.model.isImage()) {
                        return _.img({class: 'field-editor--media-reference__preview', src: '/media/' + HashBrown.Context.projectId + '/' + HashBrown.Context.environment + '/' + this.model.id + '?width=200'});
                    }
                })
            ).click(() => { this.onClickSelect() }),
            _.div({class: 'field-editor--media-reference__footer'},
                _.label({class: 'field-editor--media-reference__name'}, this.model ? this.model.name : ''),
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
