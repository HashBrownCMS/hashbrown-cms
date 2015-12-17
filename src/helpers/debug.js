'use strict';

class Debug {
    static error(err) {
        console.log('!!! Putaitu [Debug]:', err);
        console.trace();
    }
}

module.exports = Debug;
