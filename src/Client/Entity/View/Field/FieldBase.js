'use strict';

/**
 * The base class for field views
 *
 * @memberof HashBrown.Entity.View.Field
 */
class FieldBase extends HashBrown.Entity.View.ViewBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/field/fieldBase');   
    }

    /**
     * Fetches view data
     */
    async fetch() {
        if(this.model.isMultilingual) {
            if(!this.model.value || this.model.value.constructor !== Object) {
                this.model.value = {};
            }

            this.state.value = this.model.value[HashBrown.Context.language];

        } else {
            this.state.value = this.model.value;

        }
    }

    /**
     * Event: Change value
     */
    onChange(newValue) {
        if(this.model.isMultilingual) {
            if(!this.model.value || this.model.value.constructor !== Object) {
                this.model.value = {};
            }

            this.model.value[HashBrown.Context.language] = newValue;
            this.model.value['_multilingual'] = true;

        } else {
            this.model.value = newValue;

        }

        this.state.value = newValue;

        this.trigger('change', this.model.value);
    }

    /**
     * Gets the placeholder
     *
     * @return {HTMLElement} Placeholder
     */
    getPlaceholder() {
        let element = document.createElement('div');
        element.className = 'field loading';

        return element;
    }
}

module.exports = FieldBase;
