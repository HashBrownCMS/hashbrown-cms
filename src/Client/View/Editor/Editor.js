'use strict';

/**
 * A basic editor that other editors inherit from
 *
 * @memberof HashBrown.Client.View.Editor
 */
class Editor extends Crisp.View {
    constructor(params) {
        super(params);

        this.fetch();
    }

    /**
     * Gets a field by label
     *
     * @param {String} label
     *
     * @return {HTMLElement} Field
     */
    getField(label) {
        for(let fieldLabel of Array.from(this.element.querySelectorAll('.editor__field__key__label') || [])) {
            if(fieldLabel.innerHTML === label) { return fieldLabel.parentElement.parentElement; }
        }

        return null;
    }
    
    /**
     * Changes a field label
     *
     * @param {String} oldLabel
     * @param {String} newLabel
     */
    changeFieldLabel(oldLabel, newLabel) {
        let field = this.getField(oldLabel);

        if(!field) { return; }

        field.querySelector('.editor__field__key__label').innerHTML = newLabel;
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

        return _.div({class: 'editor__field' + (config.isCollapsible ? ' collapsible' : '') + (config.isCollapsed ? ' collapsed' : ''), 'data-key': config.key },
            _.div({class: 'editor__field__key'},
                _.div({class: 'editor__field__key__label', 'data-sort-key': config.sortKey}, config.label)
                    .click((e) => {
                        if(!config.isCollapsible) { return; }

                        e.currentTarget.parentElement.parentElement.classList.toggle('collapsed');
                    }),
                _.if(config.description,
                    _.div({class: 'editor__field__key__description'}, config.description)
                ),
                _.if(config.actions,
                    _.div({class: 'editor__field__key__actions'}, 
                        _.each(config.actions, (name, handler) => {
                            return _.button({class: 'editor__field__key__action editor__field__key__action--' + name, title: name[0].toUpperCase() + name.slice(1) + ' "' + config.label + '"'})
                                .click((e) => { handler(e); })
                        })
                    )
                )
            ),
            _.each(config.toolbar, (label, content) => {
                return _.div({class: 'editor__field__toolbar'},
                    _.div({class: 'editor__field__toolbar__label'}, label),
                    content
                );
            }),
            _.do(() => {
                if(value[0] && value[0] instanceof HashBrown.View.Editor.FieldEditor.FieldEditor) {
                    return value;
                }
                
                return _.div({class: 'editor__field__value' + (config.isCluster ? ' cluster' : '')},
                    _.if(config.isLocked,
                        _.input({class: 'editor__field__value__lock', title: 'Only edit this field if you know what you\'re doing', type: 'checkbox', checked: true})
                    ),
                    value
                );
            })
        );
    }
}

module.exports = Editor;
