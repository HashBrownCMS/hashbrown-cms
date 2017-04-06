'use strict';

const FieldEditor = require('./FieldEditor');

/**
 * A CSV string editor
 */
class TagsEditor extends FieldEditor {
    constructor(params) {
        super(params);

        this.init();
    }

    /**
     * Event: Change
     */
    onChange() {
        this.trigger('change', this.value);

        this.cleanUpTags();

        this.renderTags();
    }
    
    /**
     * Event: Click add tag
     */
    onClickAdd() {
        let tags = (this.value || '').split(',');

        tags.push('new tag');

        this.value = tags.join(',');

        this.onChange();
    }

    /**
     * Event: Click remove tag
     *
     * @param {String} tag
     */
    onClickRemove(tag) {
        let tags = (this.value || '').split(',');

        for(let i  = tags.length - 1; i >= 0; i--) {
            if(tags[i] == tag) {
                tags.splice(i, 1);
                break;
            }
        }

        this.value = tags.join(',');

        this.onChange();
    }

    /**
     * Event: On change tag
     *
     * @param {String} oldTag
     * @param {String} newTag
     */
    onChangeTag(oldTag, newTag) {
        let tags = (this.value || '').split(',');

        for(let i in tags) {
            if(tags[i] == oldTag) {
                tags[i] = newTag;
                break;
            }
        }

        this.value = tags.join(',');

        this.onChange();
    }

    /**
     * Cleans up tags
     */
    cleanUpTags() {
        let tags = (this.value || '').split(',');

        for(let i  = tags.length - 1; i >= 0; i--) {
            if(!tags[i]) {
                tags.splice(i, 1);
            }
        }

        this.value = tags.join(',');
    }

    /**
     * Renders all tags
     */
    renderTags() {
        _.append(this.$tags.empty(), 
            _.each((this.value || '').split(','), (i, tag) => {
                if(tag) {
                    let $input;

                    return _.div({class: 'chip'},
                        $input = _.input({type: 'text', class: 'chip-label', value: tag})
                            .change(() => { this.onChangeTag(tag, $input.val()); }),
                        _.button({class: 'btn chip-remove'}, 
                            _.span({class: 'fa fa-remove'})
                        ).click(() => { this.onClickRemove(tag); })
                    );
                }
            }),
            _.button({class: 'btn chip-add'},
                _.span({class: 'fa fa-plus'})
            ).click(() => { this.onClickAdd(); })
        );
    }

    render() {
        var editor = this;

        // Main element
        this.$element = _.div({class: 'field-editor tags-editor'},
            // Render preview
            this.renderPreview(),

            _.if(this.disabled,
                _.p(this.value || '(none)')
            ),
            _.if(!this.disabled,
                this.$tags = _.div({class: 'tags chip-group'})
            )
        );

        this.renderTags();
    }
}

module.exports = TagsEditor;
