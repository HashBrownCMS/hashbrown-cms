'use strict';

/**
 * The base for all field editors
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */
class FieldEditor extends Crisp.View {
    /**
     * Renders the config editor
     *
     * @param {Object} config
     *
     * @returns {HTMLElement} Element
     */
    static renderConfigEditor(config) {
        return null;
    }

    /**
     * Renders key actions
     *
     * @returns {HTMLElement} Actions
     */
    renderKeyActions() {}

    /**
     * Post render
     */
    postrender() {
        if(this.className) {
            this.element.classList.toggle(this.className, true);
        }
        
        if(this.$keyActions) {
            _.append(this.$keyActions.empty(),
                this.renderKeyActions()
            );
        }
    }
}

module.exports = FieldEditor;
