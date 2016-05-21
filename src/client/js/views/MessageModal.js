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
                otherModals[i].remove();
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
        } else {
            this.hide();
        }
    }

    render() {
        let view = this;

        this.$element = _.div({class: 'modal fade'},
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
                                    return _.button({class: 'btn ' + button.class},
                                        button.label
                                    ).click(function() {
                                        view.hide();

                                        button.callback();
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

        this.$element.modal('show');
    }
}

module.exports = MessageModal;
