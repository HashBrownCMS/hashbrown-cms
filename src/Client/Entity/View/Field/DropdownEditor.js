'use strict';

/**
 * A date/time field
 *
 * @memberof {HashBrown.Client.Entity.View.Field}
 */
class DropdownEditor extends HashBrown.Entity.View.Field.FieldBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.editorTemplate = require('template/field/editor/dropdownEditor');
        this.configTemplate = require('template/field/config/dropdownEditor');
    }
    
    /**
     * Gets the value label
     *
     * @return {String}
     */
    async getValueLabel() {
        if(this.state.value) {
            for(let label in this.model.config.options) {
                if(this.model.config.options[label] !== this.state.value) { continue; }

                return label;
            }

            return this.state.value;
        }

        return await super.getValueLabel();
    }

    /**
     * Fetches the view data
     */
    async fetch() {
        await super.fetch();

        if(Array.isArray(this.model.config.options)) {
            let options = {};

            for(let option of this.model.config.options) {
                if(!option) { continue; }

                if(typeof option === 'string') {
                    options[option] = option;
                
                } else if(option.value) {
                    options[option.label || option.value] = option.value;

                }
            }

            this.model.config.options = options;
        }
    }
}

module.exports = DropdownEditor;
