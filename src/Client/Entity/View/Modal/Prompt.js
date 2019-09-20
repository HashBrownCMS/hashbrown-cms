'use strict';

/**
 * A modal for responding yes/no
 *
 * @memberof HashBrown.Client.Entity.View.Modal
 */
class Prompt extends HashBrown.Entity.View.Modal.ModalBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/modal/prompt');
    }

    /**
     * Event: Change input
     */
    onChange(newValue) {
        this.model.value = newValue;
    }

    /**
     * Event: Click OK
     */
    onClickOK() {
        this.trigger('ok', this.model.value);

        this.close();
    }
}

module.exports = Prompt;
