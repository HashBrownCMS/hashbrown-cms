'use strict';

/**
 * A highlight modal
 *
 * @memberof HashBrown.Client.Entity.View.Modal
 */
class Highlight extends HashBrown.Entity.View.Modal.ModalBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/modal/highlight');

        this.model.element.parentElement.appendChild(this.element);
    }

    /**
     * Event: Click dismiss
     */
    onClickDismiss() {
        this.trigger('cancel');
        this.remove();
    }

    /**
     * Event: Click self
     */
    onClickHighlight() {
        if(this.model.buttonLabel) { return; }

        this.trigger('cancel');
        this.remove();
    }
}

module.exports = Highlight;
