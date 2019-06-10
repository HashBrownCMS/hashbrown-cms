'use strict';

function isSupported(evalString) {
    try {
        eval(evalString);
        
        return true;

    } catch(e) {
        return false;
    
    }
}
    
if(!isSupported('async () => {}')) {
    location = '/update-browser';
}
