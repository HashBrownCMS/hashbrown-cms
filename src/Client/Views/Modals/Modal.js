'use strict';

/**
 * A generic modal
 *
 * @memberof HashBrown.Client.Views.Modals
 */
class Modal extends Crisp.View {
    /**
     * Constructor
     */
    constructor(params) {
        params = params || {};
        params.actions = params.actions || [];

        super(params);

        this.fetch();

        document.body.appendChild(this.element);

        setTimeout(() => {
            this.element.classList.toggle('in', true);
        }, 50);
    }
    
    /**
     * Close this modal
     *
     */
    close() {
        this.element.classList.toggle('in', false);

        setTimeout(() => {
            this.remove();
        }, 500);
    }

    /**
     * Renders the modal body
     *
     * @returns {HTMLElement} Body
     */
    renderBody() {

    }

    /**
     * Renders this modal
     */
    template() {
        return _.div({class: 'modal'},
            _.div({class: 'modal__dialog'},
                _.if(this.title,
                    _.div({class: 'modal__header'}, 
                        _.h4({class: 'modal__title'}, this.title),
                        _.button({class: 'modal__close fa fa-close'})
                            .click(() => { this.close(); })
                    )
                ),
                _.div({class: 'modal__body'},
                    this.renderBody() 
                ),
                _.if(this.actions.length > 0,
                    _.div({class: 'modal__footer'})
                )
            )
        );
    }
}

module.exports = Modal;
