'use strict';

/**
 * The modal for editing form inputs
 *
 * @memberof HashBrown.Client.Entity.View.Modal
 */
class EditFormInput extends HashBrown.Entity.View.Modal.ModalBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/modal/editFormInput');

        this.model.definition = this.model.definition || {};
    }
    
    /**
     * Event: Change key
     */
    onChangeKey(newValue) {
        this.model.key = newValue;

        this.trigger('changekey', this.model.key);
    }
    
    /**
     * Event: Change type
     */
    onChangeType(newValue) {
        this.model.definition.type = newValue;

        this.trigger('change', this.model.definition);

        this.update();
    }

    /**
     * Event: Change is required
     */
    onChangeIsRequired(newValue) {
        this.model.definition.required = newValue;

        this.trigger('change', this.model.definition);
    }
    
    /**
     * Event: Change check duplicates
     */
    onChangeCheckDuplicates(newValue) {
        this.model.definition.checkDuplicates = newValue;

        this.trigger('change', this.model.definition);
    }
    
    /**
     * Event: Change pattern
     */
    onChangePattern(newValue) {
        this.model.definition.pattern = newValue;

        this.trigger('change', this.model.definition);
    }

    /**
     * Event: Change options
     */
    onChangeOptions(newValue) {
        this.model.definition.options = newValue;

        this.trigger('change', this.model.definition);
    }
}

module.exports = EditFormInput;
