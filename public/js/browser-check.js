'use strict';

function isSupported(feature) {
    var scriptElement = document.createElement('script');

    return feature in scriptElement;
}

if(!isSupported('async')) {
    location = '/update-browser';
}
