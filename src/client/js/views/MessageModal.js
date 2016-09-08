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

    render() {
        let view = this;

        this.$element = _.div({class: 'modal fade ' + (this.model.class ? this.model.class : '')},
            _.div({class: 'modal-dialog'},
                _.div({class: 'modal-content'},
                    _.div({class: 'modal-header'},
                        _.h4({class: 'modal-title'}, this.model.title)
                    ),
                    _.div({class: 'modal-body'},
                        this.model.body
                    ),
                    _.div({class: 'modal-footer'},
                        function() {
                            if(view.buttons) {
                                return _.each(view.buttons, function(i, button) {
                                    return _.button({class: 'btn ' + button.class, disabled: button.disabled},
                                        button.label
                                    ).click(function() {
                                        if(button.callback) {
                                            if(button.callback() != false) {
                                                view.hide();
                                            }
                                        
                                        } else {
                                            view.hide();
                                        }
                                    })
                                });

                            } else {
                                return _.button({class: 'btn btn-default'},
                                    'OK'
                                ).click(function() { view.onClickOK(); })
                            }
                        }()
                    )
                )
            )
        );

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
