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
     * Gets the key actions
     *
     * @returns {Object} Key actions
     */
    getKeyActions() {}

    /**
     * Gets the field label
     *
     * @return {String} Label
     */
    getFieldLabel() {
        let label = '';
        
        if(this.value !== null && this.value !== undefined && (typeof this.value === 'string' || typeof this.value === 'number')) {
            label = this.value.toString();
        }

        if(!label) {
            label = this.schema.name;
        }
        
        label = new DOMParser().parseFromString(label, 'text/html').body.textContent || '';
        
        if(label.length > 80) {
            label = label.substring(0, 77) + '...';
        }
        
        return label;
    }

    /**
     * A sanity check for fields
     *
     * @param {Object} value
     * @param {Object} definition
     *
     * @return {Object} Checked value
     */
    static fieldSanityCheck(value, definition) {
        // If the definition value is set to multilingual, but the value isn't an object, convert it
        if(definition.multilingual && (!value || typeof value !== 'object')) {
            let oldValue = value;

            value = {};
            value[HashBrown.Context.language] = oldValue;
        }

        // If the definition value is not set to multilingual, but the value is an object
        // containing the _multilingual flag, convert it
        if(!definition.multilingual && value && typeof value === 'object' && value._multilingual) {
            value = value[HashBrown.Context.language];
        }

        // Update the _multilingual flag
        if(definition.multilingual && value && !value._multilingual) {
            value._multilingual = true;    
        
        } else if(!definition.multilingual && value && value._multilingual) {
            delete value._multilingual;

        }

        return value;
    }

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
