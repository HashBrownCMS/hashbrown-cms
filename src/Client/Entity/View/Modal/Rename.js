'use strict';

/**
 * The modal for renaming things
 *
 * @memberof HashBrown.Client.Entity.View.Modal
 */
class Rename extends HashBrown.Entity.View.Modal.ModalBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/modal/rename');
    }

    /**
     * Event: Clicked add
     */
    async onClickRename() {
        this.trigger('submit', this.state.newName); 

        this.close();
    }
        
    /**
     * Event: Input name
     */
    onInputName(name) {
        this.state.newName = name;
    }
}

module.exports = Rename;
