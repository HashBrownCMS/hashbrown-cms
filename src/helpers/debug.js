'use strict';

function makeTitle(src) {
    let title = 'Putaitu ';
    
    if(typeof src === 'string') {
        title += '(' + src + ')';

    } else if(src && src.constructor) {
        title += '(' + src.constructor.name + ')';
    
    }

    title += ':';

    return title;
}

class Debug {
    static error(err, src, obj) {
        console.log('[ERROR] ' + makeTitle(src), err, obj);
        console.trace();
    }

    static log(msg, src) {
        console.log(makeTitle(src), msg);
    }
}

module.exports = Debug;
