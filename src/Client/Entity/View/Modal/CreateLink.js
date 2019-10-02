'use strict';

/**
 * A modal for creating links in the rich text widget
 *
 * @memberof HashBrown.Client.Entity.View.Modal
 */
class CreateLink extends HashBrown.Entity.View.Modal.ModalBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/modal/createLink');
    }

    /**
     * Post render
     */
    postrender() {
        setTimeout(() => {
            this.namedElements.input.element.focus();
        }, 500);
    }

    /**
     * Event: Change URL
     */
    onChangeUrl(newValue) {
        this.model.url = newValue;
    }

    /**
     * Event: Change new tab
     */
    onChangeNewTab(newValue) {
        this.model.newTab = newValue;
    }

    /**
     * Event: Click OK
     */
    onClickOK() {
        this.trigger('ok', this.model.url, this.model.newTab);

        this.close();
    }
}

module.exports = CreateLink;
