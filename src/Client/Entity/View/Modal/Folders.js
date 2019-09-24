'use strict';

/**
 * The modal for picking/creating/removing folders
 *
 * @memberof HashBrown.Client.Entity.View.Modal
 */
class Folders extends HashBrown.Entity.View.Modal.ModalBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/modal/folders');
    }
    
    /**
     * Event: Picked folder
     */
    onPick(path) {
        this.trigger('picked', path);

        this.close();
    }
}

module.exports = Folders;
