'use strict';

let env = require('../../env.json');

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
        if(obj) {
            console.log('[ERROR] ' + makeTitle(src), err, obj);
        } else {
            console.log('[ERROR] ' + makeTitle(src), err);
        }
            
        console.trace();
    }

    static log(msg, src) {
        if(env.debug.verbosity > 0) {
            console.log(makeTitle(src), msg);
        }
    }
    
    static log2(msg, src) {
        if(env.debug.verbosity > 1) {
            console.log('-- ' + makeTitle(src), msg);
        }
    }
    
    static log3(msg, src) {
        if(env.debug.verbosity > 2) {
            console.log('--- ' + makeTitle(src), msg);
        }
    }
}

module.exports = Debug;
