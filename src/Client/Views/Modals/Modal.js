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

        if(typeof params.actions === 'undefined') {
            params.actions = [];
        }

        super(params);

        // If this belongs to a group, find existing modals and append instead
        if(this.group) {
            for(let modal of Crisp.View.getAll('Modal')) {
                if(modal.group !== this.group || modal === this) { continue; }

                modal.append(this);

                this.remove();
                break;
            }
        }

        if(this.autoFetch !== false) {
            this.fetch();
        }
        
        document.body.appendChild(this.element);
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
        return this.body;
    }
    
    /**
     * Renders the modal footer
     *
     * @returns {HTMLElement} Footer
     */
    renderFooter() {
        if(this.actions === false) { return; }

        if(this.actions && this.actions.length > 0) {
            return _.each(this.actions, (i, action) => {
                return _.button({class: 'widget widget--button ' + (action.class || '')}, action.label)
                    .click(() => {
                        if(typeof action.onClick !== 'function') {
                            return this.close();
                        }

                        if(action.onClick() !== false) {
                            this.close();
                        }
                    });
            });
        }

        return _.button({class: 'widget widget--button'}, 'OK')
            .click(() => {
                this.close();

                this.trigger('ok');
            });
    }
    
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

        if(!this.hasTransitionedIn) {
            setTimeout(() => {
                this.hasTransitionedIn = true;
                this.element.classList.toggle('in', true);
            }, 50);
        }
        
        return _.div({class: 'modal' + (this.hasTransitionedIn ? ' in' : '') + (this.group ? ' ' + this.group : '') + (this.className ? ' modal--' + this.className : '')},
            _.div({class: 'modal__dialog'},
                _.div({class: 'widget--spinner embedded hidden'},
                    _.div({class: 'widget--spinner__image fa fa-refresh'})
                ),
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

    /**
     * Appends another modal to this modal
     *
     * @param {Modal} modal
     */
    append(modal) {
        this.$element.find('.modal__footer').before(_.div({class: 'modal__body'}, modal.renderBody()));
    }
}

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
});

module.exports = Modal;
