'use strict';

/**
 * The base for all field editors
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */
class FieldEditor extends HashBrown.Views.Editors.Editor {
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
     * Gets the key actions
     *
     * @returns {Object} Key actions
     */
    getKeyActions() {}

    /**
     * Post render
     */
    postrender() {
        if(this.className) {
            this.element.classList.toggle(this.className, true);
        }
    }
}

module.exports = FieldEditor;
