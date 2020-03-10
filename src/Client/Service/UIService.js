'use strict';

/**
 * A UI helper for creating and handling common interface behaviours
 *
 * @memberof HashBrown.Client.Service
 */
class UIService {
    /**
     * Highlights an element with an optional label
     *
     * @param {Boolean|HTMLElement} element
     * @param {String} label
     * @param {String} direction
     * @param {String} buttonLabel
     *
     * @return {Promise} Callback on dismiss
     */
    static highlight(element, label, direction = 'right', buttonLabel) {
        if(element === false) {
            $('.widget--highlight').remove();

            return;
        }

        if(typeof element === 'string') {
            element = document.querySelector(element);
        }

        if(!element) { return Promise.resolve(); }

        return new Promise((resolve) => {
            let highlight = new HashBrown.Entity.View.Modal.Highlight({
                model: {
                    element: element,
                    label: label,
                    direction: direction,
                    buttonLabel: buttonLabel
                }
            });

            highlight.on('cancel', () => {
                resolve(element);
            });
        });
    }

    /**
     * Brings up an error modal
     *
     * @param {String|Error} error
     * @param {Function} onClickOK
     */
    static error(error, onClickOK) {
        if(!error) { return; }

        if(error instanceof String) {
            error = new Error(error);
        
        } else if(error.responseText) {
            error = new Error(error.responseText);
        
        } else if(error instanceof ErrorEvent) {
            error = error.error;

        } else if(error instanceof Event) {
            error = error.target.error;
        
        } else if(error instanceof Error === false) {
            error = new Error(error.toString());

        }
       
        debug.log(error.message + ': ' + error.stack, 'HashBrown');

        return this.notify('Error', error.message, onClickOK, 'error');
    }
    
    /**
     * Brings up a small notification
     *
     * @param {String} heading
     * @param {String} message
     * @param {Number} timeout
     */
    static notifySmall(heading, message, timeout) {
        let modal = new HashBrown.Entity.View.Modal.ModalBase({
            model: {
                heading: heading,
                message: message,
                role: 'notification-small'
            }
        });

        if(!isNaN(timeout)) {
            setTimeout(() => { modal.close(); }, timeout * 1000);
        }

        return modal;
    }
    
    /**
     * Brings up a notification
     *
     * @param {String} heading
     * @param {String} message
     * @param {Function} onClickOK
     */
    static notify(heading, message, onClickOK) {
        let modal = new HashBrown.Entity.View.Modal.ModalBase({
            model: {
                heading: heading,
                message: message,
                role: 'notification'
            }
        });

        if(typeof onClickOK === 'function') {
            modal.on('ok', onClickOK);
        }

        return modal;
    }

    /**
     * Brings up a prompt modal
     *
     * @param {String} heading
     * @param {String} message
     * @param {String} widget
     * @param {*} value
     * @param {Function} onClickOK
     */
    static prompt(heading, message, widget, value, onClickOK) {
        let modal = new HashBrown.Entity.View.Modal.Prompt({
            model: {
                heading: heading,
                message: message,
                widget: widget,
                value: value
            }
        });

        if(onClickOK) {
            modal.on('ok', onClickOK);
        }

        return modal;
    }
        
    /**
     * Brings up a confirm modal
     *
     * @param {String} heading
     * @param {String} message
     * @param {Function} onClickYes
     * @param {Function} onClickNo
     */
    static confirm(heading, message, onClickYes, onClickNo) {
        let modal = new HashBrown.Entity.View.Modal.Confirm({
            model: {
                heading: heading,
                message: message
            }
        });

        if(onClickYes) {
            modal.on('yes', onClickYes);
        }

        if(onClickNo) {
            modal.on('no', onClickNo);
        }

        return modal;
    }
}

module.exports = UIService;
