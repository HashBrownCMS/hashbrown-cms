'use strict';

let lastSenderName = '';

class DebugHelper {
    /**
     * Logs a message
     *
     * @param {String} message
     * @param {Object} sender
     * @param {Number} verbosity
     */
    static log(message, sender, verbosity) {
        if(verbosity == 0) {
            this.error('Verbosity cannot be set to 0', this);

        } else if(!verbosity) {
            verbosity = 1;
        }

        if(this.verbosity >= verbosity) {
            console.log(this.parseSender(sender), this.getDateString(), message);
        }
    }

    /**
     * Gets the date string
     *
     * @returns {String} date
     */
    static getDateString() {
        let date = new Date();

        let output =
            '(' +
            date.getFullYear() + '/' +
            (date.getMonth() + 1) + '/' +
            date.getDate() + '-' +
            date.getHours() + ':' + 
            date.getMinutes() + ':' + 
            date.getSeconds() +
            ')';

        return output;
    }
    
    /**
     * Parse sender
     *
     * @param {Object} sender
     *
     * @returns {String} name
     */
    static parseSender(sender) {
        let senderName = '';

        if(sender) {
            if(typeof sender === 'function') {
                senderName += sender.name;

            } else if(sender.constructor) {
                senderName += sender.constructor.name;
            
            } else {
                senderName += sender.toString();

            }

            senderName;
        }

        if(senderName == lastSenderName) {
            senderName = '';

        } else {
            lastSenderName = senderName;
            senderName = '\n' + senderName + '\n----------\n';

        }

        return senderName;
    }

    /**
     * Throws an error
     *
     * @param {String} message
     * @param {Object} sender
     */
    static error(message, sender) {
        throw new Error(this.parseSender(sender) + ' ' + this.getDateString() + ' ' + message);
    }

    /**
     * Shows a warning
     */
    static warning(message, sender) {
        console.log(this.parseSender(sender), this.getDateString(), message);
        console.trace();
    }
}

module.exports = DebugHelper;
