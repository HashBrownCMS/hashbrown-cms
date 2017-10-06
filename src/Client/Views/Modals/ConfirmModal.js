'use strict';

const Modal = require('./Modal');

/**
 * A modal for confirming actions
 *
 * @memberof HashBrown.Client.Views.Modals
 */
class ConfirmModal extends Modal {
    /**
     * Post render
     */
    postrender() {
        this.element.classList.toggle('modal--confirm', true);
    }

    /**
     * Render header
     */
    renderHeader() {
        return _.h4({class: 'modal--date__header__title'}, this.title);
    }
    
    /**
     * Renders the modal footer
     *
     * @returns {HTMLElement} Footer
     */
    renderFooter() {
        let okClass = '';

        switch(this.type) {
            case 'delete': case 'remove': case 'discard': case 'clear':
                okClass = 'warning';
                break;
        }

        return [
            _.button({class: 'widget widget--button standard'}, 'Cancel')
                .click(() => {
                    this.trigger('cancel');

                    this.close();
                }),
            _.button({class: 'widget widget--button ' + okClass}, 'OK')
                .click(() => {
                    this.trigger('ok');

                    this.close();
                })
        ];
    }

    /**
     * Render body
     */
    renderBody() {
        return this.body;
    }
}

module.exports = ConfirmModal;
