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

        this.model.innerTemplate = require('template/field/inc/dropdownEditor');
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
    
    /**
     * Gets tools for this field
     *
     * @return {Array} Tools
     */
    getTools() {
        return [];
    }
}

module.exports = DropdownEditor;
