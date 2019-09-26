'use strict';

/**
 * A generic modal
 *
 * TODO: Enable ESC to cancel
 * TODO: Enable grouping
 *
 * @memberof HashBrown.Client.Entity.View.Modal
 */
class ModalBase extends HashBrown.Entity.View.ViewBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/modal/modalBase'); 

        let similarModals = this.getSimilarModals();

        if(similarModals.length > 0) {
            let body = similarModals[0].querySelector('.modal__body');
           
            if(!body) {
                similarModals[0].parentElement.removeChild(similarModals[0]);

                document.body.appendChild(this.element);

            } else {
                this.state.prependedHtml = body.innerHTML;
                this.element = similarModals[0];
                this.state.skipTransitionIn = true;
            }

        } else {
            document.body.appendChild(this.element);
        
        }
    }
  
    /**
     * Gets existing modals with the same role as this one
     *
     * @return {Array} Modal elements
     */
    getSimilarModals() {
        if(!this.model.role) { return []; }

        return Array.from(document.querySelectorAll('.modal[role="' + this.model.role + '"]'));
    }

    /**
     * Init
     */
    async init() {
        await super.init();
            
        if(this.state.skipTransitionIn) { return; }

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
        this.element.classList.toggle('loading', !isActive);
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
}

module.exports = ModalBase;
