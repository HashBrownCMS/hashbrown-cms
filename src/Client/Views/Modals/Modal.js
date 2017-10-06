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
    renderBody() { }
    
    /**
     * Renders the modal footer
     *
     * @returns {HTMLElement} Footer
     */
    renderFooter() { }
    
    /**
     * Renders the modal header
     *
     * @returns {HTMLElement} Header
     */
    renderHeader() {
        if(!this.title) { return; }

        return [
            _.h4({class: 'modal__title'}, this.title),
            _.button({class: 'modal__close fa fa-close'})
                .click(() => { this.close(); })
        ];
    }

    /**
     * Renders this modal
     */
    template() {
        let header = this.renderHeader();
        let body = this.renderBody();
        let footer = this.renderFooter();

        return _.div({class: 'modal'},
            _.div({class: 'modal__dialog'},
                _.if(header,
                    _.div({class: 'modal__header'},
                        header
                    )
                ),
                _.if(body,
                    _.div({class: 'modal__body'},
                        body 
                    )
                ),
                _.if(footer,
                    _.div({class: 'modal__footer'},
                        footer
                    )
                )
            )
        );
    }
}

module.exports = Modal;
