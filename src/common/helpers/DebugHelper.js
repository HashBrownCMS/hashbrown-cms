'use strict';

const VERBOSITY = 2;

class DebugHelper {
    /**
     * Event: Log
     *
     * @param {String} senderString
     * @param {String} dateString
     * @param {String} message
     */
    static onLog(senderString, dateString, message) {
    
    }

    /**
     * Gets the date string
     *
     * @returns {String} date
     */
    static getDateString() {
        let date = new Date();

        let monthString = (date.getMonth() + 1);

        if(monthString < 10) {
            monthString = '0' + monthString;
        }

        let dateString = date.getDate();

        if(dateString < 10) {
            dateString = '0' + dateString;
        }
        
        let hoursString = date.getHours();

        if(hoursString < 10) {
            hoursString = '0' + hoursString;
        }
        
        let minutesString = date.getMinutes();

        if(minutesString < 10) {
            minutesString = '0' + minutesString;
        }
        
        let secondsString = date.getSeconds();

        if(secondsString < 10) {
            secondsString = '0' + secondsString;
        }

        let output =
            date.getFullYear() + '.' +
            monthString + '.' +
            dateString + ' ' +
            hoursString + ':' + 
            minutesString + ':' + 
            secondsString +
            ' |';

        return output;
    }
    
    /**
     * Parse sender
     *
     * @param {Object} sender
     *
     * @returns {String} name
     */
    static parseSender(sender, ignoreLast) {
        let senderName = '';

        if(sender) {
            if(typeof sender === 'string') {
                senderName = sender;

            } else if(typeof sender === 'function') {
                senderName = sender.name;

            } else if(sender.constructor) {
                senderName = sender.constructor.name;
            
            } else {
                senderName = sender.toString();

            }
        }

        return senderName + ' |';
    }
    
    /**
     * Logs a message
     *
     * @param {String} message
     * @param {Object} sender
     * @param {Number} verbosity
     */
    static log(message, sender, verbosity = 1) {
        if(verbosity == 0) {
            DebugHelper.error('Verbosity cannot be set to 0', this);

        } else if(!verbosity) {
            verbosity = 1;
        }

        if(VERBOSITY >= verbosity) {
            let senderString = DebugHelper.parseSender(sender);
            let dateString = DebugHelper.getDateString();
            
            console.log(dateString, senderString, message);
            DebugHelper.onLog(dateString, senderString, message);
        }
    }

    /**
     * Throws an error
     *
     * @param {String} message
     * @param {Object} sender
     */
    static error(message, sender) {
        if(message instanceof Error) {
            message = message.message || message.trace;
        }

        console.log(DebugHelper.getDateString(), DebugHelper.parseSender(sender), message);

        throw new Error(message);
    }

    /**
     * Shows a warning
     */
    static warning(message, sender) {
        console.log(DebugHelper.getDateString(), DebugHelper.parseSender(sender), message);
        console.trace();
    }
}

module.exports = DebugHelper;
