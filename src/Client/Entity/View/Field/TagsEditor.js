'use strict';

/**
 * A list of comma-separated strings
 *
 * @memberof {HashBrown.Client.Entity.View.Field}
 */
class TagsEditor extends HashBrown.Entity.View.Field.FieldBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/field/tagsEditor');
    }

    /**
     * Fetches view data
     */
    async fetch() {
        await super.fetch();

        this.state.value = (this.state.value || '').split(',')
        this.state.value = this.state.value.filter((x) => !!x);
    }

    /**
     * Event: Changed value
     */
    onChange(newValue) {
        newValue = newValue.join(',');

        super.onChange(newValue);
    }
}

module.exports = TagsEditor;
