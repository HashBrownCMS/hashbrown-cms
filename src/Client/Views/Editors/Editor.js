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
     * @param {Object} config
     * @param {HTMLElement|Array} value
     *
     * @return {HTMLElement} Element
     */
    field(config, ...value) {
        if(typeof config == 'string') {
            config = { label: config };
        }

        return _.div({class: 'editor__field' + (config.isCollapsible ? ' collapsible collapsed' : '')},
            _.div({class: 'editor__field__key'},
                _.div({class: 'editor__field__key__label'}, config.label)
                    .click((e) => {
                        if(!config.isCollapsible) { return; }

                        e.currentTarget.parentElement.parentElement.classList.toggle('collapsed');
                    }),
                _.if(config.description,
                    _.div({class: 'editor__field__key__description'}, config.description)
                ),
                _.if(config.actions,
                    _.div({class: 'editor__field__key__actions'}, config.actions)
                )
            ),
            _.div({class: 'editor__field__value'},
                _.if(config.isLocked,
                    _.input({class: 'editor__field__value__lock', title: 'Only edit this field if you know what you\'re doing', type: 'checkbox', checked: true})
                ),
                value
            )
        );
    }
}

module.exports = Editor;
