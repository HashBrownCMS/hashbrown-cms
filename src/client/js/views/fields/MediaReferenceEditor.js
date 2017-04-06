'use strict';

const FieldEditor = require('./FieldEditor');

/**
 * A picker for referencing Media 
 */
class MediaReferenceEditor extends FieldEditor {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'field-editor media-reference-editor'},
            // Render preview
            this.renderPreview(),

            this.$body = _.button({class: 'thumbnail raised'})
                .click(() => { this.onClickBrowse(); }),
            _.button({class: 'btn btn-remove'},
                _.span({class: 'fa fa-remove'})
            ).click((e) => { e.stopPropagation(); e.preventDefault(); this.onClickRemove(); })
        );

        this.init();
    }

    /**
     * Event: Change value
     */
    onChange() {
        this.trigger('change', this.value);

        this.render();
    }

    /**
     * Event: Click remove
     */
    onClickRemove() {
        this.value = null;

        this.onChange();
    }

    /**
     * Event: Click browse
     */
    onClickBrowse() {
        let mediaBrowser = new MediaBrowser({
            value: this.value
        });

        mediaBrowser.on('select', (id) => {
            this.value = id;
            this.onChange();
        });
    }

    render() {
        if(!this.value) {
            this.$body.empty();
            return;
        }

        let media = (resources.media || []).filter((m) => {
            return m.id == this.value;
        })[0];
        
        if(!media) {
            this.$body.empty();
            return;
        }

        media = new Media(media);

        _.append(this.$body.empty(),
            _.if(media.isVideo(),
                _.video({src: '/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + media.id})
            ),
            _.if(media.isImage(),
                _.img({src: '/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + media.id})
            ),
            _.label(media.name)
        );
    }
}

module.exports = MediaReferenceEditor;
