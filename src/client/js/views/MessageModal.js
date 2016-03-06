'use strict';

/**
 * A basic modal for displaying messages to the user
 */
class MessageModal extends View {
    constructor(params) {
        super(params);

        ViewHelper.removeAll('MessageModal');

        this.fetch();
    }

    hide() {
        this.$element.modal('hide');
    }
    
    show() {
        this.$element.modal('show');
    }

    render() {
        this.$element = _.div({class: 'modal fade'},
            _.div({class: 'modal-dialog'},
                _.div({class: 'modal-content'}, [
                    _.div({class: 'modal-header'}, [
                        _.button({class: 'close', 'data-dismiss': 'modal'},
                            _.span({class: 'fa fa-close'})
                        ).click(function() { this.hide(); }),
                        _.h4({class: 'modal-title'}, this.model.title)
                    ]),
                    _.div({class: 'modal-body'},
                        this.model.body
                    ),
                    _.div({class: 'modal-footer'},
                        _.button({class: 'btn btn-default', 'data-dismiss': 'modal'},
                            'OK'
                        ).click(function() { this.hide(); })
                    )
                ])
            )
        );

        $('body').append(this.$element);

        this.$element.modal('show');
    }
}

module.exports = MessageModal;
