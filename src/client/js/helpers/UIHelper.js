'use strict';

class UIHelper {
    /**
     * Creates a switch
     *
     * @param {Boolean} initialValue
     * @param {Function} onChange
     *
     * @returns {HTMLElement} Switch element
     */
    static inputSwitch(initialValue, onChange) {
        let id = 'switch' + (10000 + Math.floor(Math.random() * 10000));

        return _.div({class: 'switch', 'data-checked': initialValue},
            _.input({
                id: id,
                class: 'form-control switch',
                type: 'checkbox',
                checked: initialValue
            }).change(function() {
                this.parentElement.dataset.checked = this.checked;

                if(onChange) {
                    onChange(this.checked);
                }
            }),
            _.label({for: id})
        );
    }

    /**
     * Brings up an error modal
     *
     * @param {String|Error} error
     */
    static errorModal(error) {
        if(error instanceof String) {
            error = new Error(error);
        
        } else if (error && error instanceof Object) {
            if(error.responseText) {
                error = new Error(error.responseText);
            }
        }

        let modal = messageModal('<span class="fa fa-warning"></span> Error', error.message + '<br /><br />Please check server log for details');

        modal.$element.toggleClass('error-modal', true);

        throw error;
    }

    /**
     * Brings up a message modal
     *
     * @param {String} title
     * @param {String} body
     */
    static messageModal(title, body, onSubmit) {
        return new MessageModal({
            model: {
                title: title,
                body: body,
                onSubmit: onSubmit
            }
        });
    }

    /**
     * Brings up a confirm modal
     *
     * @param {String} type
     * @param {String} title
     * @param {String} body
     * @param {Function} onSubmit
     */
    static confirmModal(type, title, body, onSubmit, onCancel) {
        let submitClass = 'btn-primary';

        type = (type || '').toLowerCase();

        switch(type) {
            case 'delete': case 'remove': case 'discard':
                submitClass = 'btn-danger';
                break;
        }

        return new MessageModal({
            model: {
                title: title,
                body: body,
                onSubmit: onSubmit
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default',
                    callback: onCancel
                },
                {
                    label: type,
                    class: submitClass,
                    callback: onSubmit
                }
            ]
        });
    }
}

window.errorModal = UIHelper.errorModal;
window.messageModal = UIHelper.messageModal;
window.confirmModal = UIHelper.confirmModal;

module.exports = UIHelper;
