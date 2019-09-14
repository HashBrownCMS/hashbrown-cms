'use strict';

/**
 * A generic modal
 *
 * @memberof HashBrown.Client.View.Modal
 */
class ModalBase extends HashBrown.Entity.View.ViewBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        // If this belongs to a group, find existing modals and append instead
        /* TODO
        if(this.group) {
            for(let modal of Crisp.View.getAll('Modal')) {
                if(modal.group !== this.group || modal === this) { continue; }

                modal.append(this);

                this.remove();
                break;
            }
        }*/

        document.body.appendChild(this.element);

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
     * Event: Clicked close
     */
    onClickClose() {
        this.close();
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

/* TODO:
// Modal key events
document.addEventListener('keyup', (e) => {
    let modal = Crisp.View.getAll(Modal).pop();
    
    if(!modal) { return; }

    switch(e.which) {
        case 27: // Escape
            if(modal.element.querySelector('.modal__close')) {
                modal.close();
            }
            break;

        case 13: // Enter
            if((!modal.actions || modal.actions.length === 0) && modal.renderFooter === Modal.renderFooter) {
                modal.close();
                modal.trigger('ok');
            } else if(modal.actions.length === 1) {
                modal.close();
                modal.actions[0].onClick();
            }
            break;
    }
});*/

module.exports = ModalBase;
