'use strict';

/**
 * A picker for referencing Media 
 */
class MediaReferenceEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'field-editor media-reference-editor'},
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
        if(this.value) {
            let mediaObject = (resources.media || []).filter((m) => {
                return m.id == this.value;
            })[0];

            if(mediaObject) {
                this.$body
                    .attr('style', 'background-image: url(\'/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + this.value + '\')')
                    .html(
                        _.label(mediaObject.name)
                    );
            } else {
                this.$body
                    .removeAttr('style')
                    .empty();
            }
        } else {
            this.$body
                .removeAttr('style')
                .empty();
        }
    }
}

module.exports = MediaReferenceEditor;
