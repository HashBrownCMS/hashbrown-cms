'use strict';

/**
 * A modal for responding yes/no
 *
 * @memberof HashBrown.Client.Entity.View.Modal
 */
class Confirm extends HashBrown.Entity.View.Modal.ModalBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/modal/confirm');
    }

    /**
     * Event: Clicked yes
     */
    async onClickYes() {
        await this.trigger('yes');

        if(this.state.name !== 'error') {
            this.close();
        }
    }
    
    /**
     * Event: Clicked no
     */
    async onClickNo() {
        await this.trigger('no');

        if(this.state.name !== 'error') {
            this.close();
        }
    }
}

module.exports = Confirm;
