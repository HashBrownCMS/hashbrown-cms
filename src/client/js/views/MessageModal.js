'use strict';

/**
 * A basic modal for displaying messages to the user
 */
class MessageModal extends View {
    constructor(params) {
        super(params);

        let otherModals = ViewHelper.getAll('MessageModal');

        for(let i in otherModals) {
            if(otherModals[i] != this) {
                otherModals[i].hide();
            }
        }

        this.$element = _.div();
        
        this.fetch();
    }

    hide() {
        this.$element.modal('hide');
    }
    
    show() {
        this.$element.modal('show');
    }

    onClickOK() {
        if(this.model.onSubmit) {
            this.model.onSubmit();
        }
        
        this.hide();
    }

    reload() {
        this.$element.find('.modal-title').html(this.renderTitle());
        this.$element.find('.modal-body').html(this.renderBody());
    }

    renderTitle() {
        return this.model.title;
    }
    
    renderBody() {
        return this.model.body;
    }

    render() {
        let view = this;

        this.$element = _.div({class: 'modal fade ' + (this.model.class ? this.model.class : '')}, 
            _.div({class: 'modal-dialog'},
                _.div({class: 'modal-content'},
                    _.div({class: 'modal-header'},
                        _.h4({class: 'modal-title'}, this.renderTitle())
                    ),
                    _.div({class: 'modal-body'},
                        this.renderBody()
                    ),
                    _.div({class: 'modal-footer'},
                        _.if(this.buttons,
                            _.each(this.buttons, (i, button) => {
                                return _.button({class: 'btn ' + button.class, disabled: button.disabled},
                                    button.label
                                ).click(() => {
                                    if(button.callback) {
                                        if(button.callback() != false) {
                                            this.hide();
                                        }
                                    
                                    } else {
                                        this.hide();
                                    }
                                })
                            })
                        ),
                        _.if(!this.buttons && this.model.onSubmit != false,
                            _.button({class: 'btn btn-default'},
                                'OK'
                            ).click(() => { this.onClickOK(); })
                        )
                    )
                )
            )
        );

        // Callback was set to false, disable dismissing
        if(this.model.onSubmit == false) {
            this.$element.attr('data-backdrop', 'static');
            this.$element.attr('data-keyboard', 'false');
        }

        $('body').append(this.$element);

        this.$element.find('a').click(function() {
            view.hide();
        });

        this.$element.modal('show');

        this.$element.on('hidden.bs.modal', () => {
            this.remove();
        });
    }
}

module.exports = MessageModal;
