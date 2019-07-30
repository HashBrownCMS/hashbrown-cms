'use strict';

/**
 * A standard widget
 *
 * @memberof HashBrown.Client.Views.Widgets
 */
class Widget extends Crisp.View {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        if(!params.isAsync) {
            this.fetch();
        }
    }

    /**
     * Adds a notifying message
     *
     * @param {String} message
     */
    notify(message) {
        let notifier = this.element.querySelector('.widget__notifier');

        if(!message) {
            if(notifier) { 
                notifier.parentElement.removeChild(notifier);
            }

            return;
        }

        if(!notifier) {
            notifier = _.div({class: 'widget__notifier'}, message);

            _.append(this.element, notifier);
        }

        notifier.innerHTML = message;
    }
    
    /**
     * Post render
     */
    postrender() {
        if(this.className) {
            this.element.classList.toggle(this.className, true);
        }
    }
}

module.exports = Widget;
