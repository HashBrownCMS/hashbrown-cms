'use strict';

/**
 * A basic editor that other editors inherit from
 *
 * @memberof HashBrown.Client.Views.Editors
 */
class Editor extends Crisp.View {
    constructor(params) {
        super(params);

        this.fetch();
    }

    /**
     * Renders a field
     *
     * @param {Object|String} key
     * @param {HTMLElement|Array} value
     *
     * @return {HTMLElement} Element
     */
    field(key, ...value) {
        return _.div({class: 'editor__field'},
            _.div({class: 'editor__field__key'},
                _.div({class: 'editor__field__key__label'}, key.label || key),
                _.if(key.description,
                    _.div({class: 'editor__field__key__description'}, key.description)
                ),
                _.if(key.actions,
                    _.div({class: 'editor__field__key__actions'}, key.actions)
                )
            ),
            _.div({class: 'editor__field__value'},
                value
            )
        );
    }
}

module.exports = Editor;
