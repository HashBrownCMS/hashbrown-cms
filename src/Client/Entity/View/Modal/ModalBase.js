'use strict';

/**
 * A generic modal
 *
 * TODO: Enable ESC to cancel
 * TODO: Enable grouping
 *
 * @memberof HashBrown.Client.View.Modal
 */
class ModalBase extends HashBrown.Entity.View.ViewBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/modal/modalBase'); 

        document.body.appendChild(this.element);
    }
  
    /**
     * Init
     */
    async init() {
        await super.init();
            
        this.element.classList.toggle('in', false);

        setTimeout(() => {
            this.element.classList.toggle('in', true);
        }, 100);
    }

    /**
     * Toggles the loading state
     *
     * @param {Boolean} isActive
     */
    setLoading(isActive) {
        let spinner = this.element.querySelector('.widget--spinner');

        spinner.classList.toggle('hidden', !isActive);
    }

    /**
     * Event: Clicked OK
     */
    onClickOK() {
        this.trigger('ok');

        this.close();
    }

    /**
     * Event: Clicked close
     */
    onClickClose() {
        this.trigger('cancel');

        this.close();
    }
    
    /**
     * Event: Click reset
     */
    onClickReset() {
        this.reset();
    }

    /**
     * Closes this modal
     */
    close() {
        this.element.classList.toggle('in', false);

        setTimeout(() => {
            this.remove();
        }, 500);
    }

    /**
     * Appends another modal to this modal
     *
     * @param {HashBrown.Entity.View.Modal.ModalBase} modal
     */
    append(modal) {
        checkParam(modal, 'modal', HashBrown.Entity.View.Modal.ModalBase, true);

        let thisBody = this.element.querySelector('modal__body');
        let thatBody = modal.element.querySelector('modal__body');

        thisBody.innerHTML += thatBody.innerHTML;
    }
}

module.exports = ModalBase;
