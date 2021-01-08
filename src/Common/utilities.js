'use strict';

// Establish the base namespace
let base;

if(typeof window !== 'undefined') {
    base = window;
    
    base.IS_CLIENT = true;
    base.IS_SERVER = false;

} else if(typeof global !== 'undefined') {
    base = global;

    base.IS_CLIENT = false;
    base.IS_SERVER = true;
}

if(!base) {
    throw new Error('Base not found');
}

/**
 * Gets a cookie by name
 *
 * @param {String} name
 *
 * @returns {String} value
 */
base.getCookie = function getCookie(name) {
    if(!IS_CLIENT) { return ''; }

    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");

    if(parts.length === 2) {
        return parts.pop().split(";").shift();
    }

    return '';
}

/**
 * Copies string to the clipboard
 *
 * @param {String} string
 */
base.copyToClipboard = function copyToClipboard(string) {
    if(!IS_CLIENT) { return; }

    let text = document.createElement('TEXTAREA');

    text.innerHTML = string;

    document.body.appendChild(text);

    text.select();

    try {
        let success = document.execCommand('copy');

        if(!success) {
            UI.error('Your browser does not yet support copying to clipboard');
        }
    } catch(e) {
        UI.error(e.toString());
    }

    document.body.removeChild(text);
}

/**
 * Checks for updates
 */
base.updateCheck = async function updateCheck() {
    if(!IS_CLIENT || !HashBrown.Client.context.user.isAdmin) { return; }

    let update = await HashBrown.Service.RequestService.customRequest('get', '/api/server/update/check');
    
    if(update && update.isBehind) {
        UI.notifySmall('Update available', 'HashBrown can be updated to ' + update.remoteVersion + '. Please check the <a href="/readme">readme</a> for instructions.'); 
    }
}

/**
 * Compares 2 semantic version strings
 *
 * @param {String} a
 * @param {String} b
 *
 * @return {Number} -1 for behind, 1 for ahead, 0 for same
 */
base.semver = function semver(a, b) {
    checkParam(a, 'a', String, true);
    checkParam(b, 'b', String, true);

    let aParts = a.replace(/[^0-9.]/g, '').split('.').filter(Boolean);
    let bParts = b.replace(/[^0-9.]/g, '').split('.').filter(Boolean);
        
    if(aParts.length !== 3 || bParts.length !== 3) {
        throw new Error(`Could not compare versions ${a} and ${b}`);
    }
   
    // A is behind
    if(
        (aParts[0] < bParts[0]) ||
        (aParts[0] <= bParts[0] && aParts[1] < bParts[1]) ||
        (aParts[1] <= bParts[1] && aParts[2] < bParts[2])
    ) {
        return -1;
    }
    
    // A is ahead
    if(
        (bParts[0] < aParts[0]) ||
        (bParts[0] <= aParts[0] && bParts[1] < aParts[1]) ||
        (bParts[1] <= aParts[1] && bParts[2] < aParts[2])
    ) {
        return 1;
    }

    // A and B are the same
    return 0;
}

/**
 * Handles library creation
 *
 * @param {String} alias
 * @param {String} name
 * @param {String} icon
 *
 * @return {Function} Chain
 */
base.library = function library(alias, name, icon) {
    HashBrown.Service.LibraryService.register(alias, name, icon);

    let add = (module) => {
        HashBrown.Service.LibraryService.addClass(module, alias);

        return { add: add };
    };

    return { add: add };
}

/**
 * Handles namespace creation
 *
 * @param {String} query
 *
 * @return {Function} Chain
 */
base.namespace = function namespace(query) {
    if(!base.HashBrown) { base.HashBrown = {}; }
    
    let current = HashBrown;

    query.split('.').forEach((ns) => {
        if(!current[ns]) { current[ns] = {}; }
        
        current = current[ns];
    });

    let add = (module) => {
        if(current[module.name]) {
            debug.error(new Error(`A module with name "${module.name}" already exists within the "${query}" namespace, skipping load`), module, true);
        
        } else {
            current[module.name] = module;
        
        }
        
        return { add: add };
    };

    return { add: add };
}

/**
 * Checks a parameter for type
 *
 * @param {Anything} value
 * @param {String} name
 * @param {Type} type
 */
base.checkParam = (value, name, type, notNull = false) => {
    if(value === undefined) {
        throw new Error('Parameter "' + name + '" is required');
    }
    
    if(notNull && (
        value === null ||
        value === '' ||
        (type === Number && isNaN(value))
    )) {
        throw new Error('Parameter "' + name + '" cannot be null');
    }

    if(value === null) { return; }
    if(value.constructor === type) { return; }
    if(value.prototype instanceof type) { return; }
    if(value instanceof type) { return; }
    if(value === type) { return; }

    let valueTypeName = typeof value;

    if(value.constructor) {
        valueTypeName = value.constructor.name;
    
    } else if(value.prototype) {
        valueTypename = value.prototype.name;

    }
    
    if(valueTypeName === 'Object') {
        value = JSON.stringify(value);
    
    } else if(typeof value.toString === 'function') {
        value = value.toString();

    } else {
        value = '(' + valueTypeName + ')';

    }

    throw new TypeError('Parameter "' + name + '" is of type "' + valueTypeName + '", should be "' + type.name + '". Value was: ' + value);
}

/**
 * Waits for N seconds
 *
 * @param {Number} seconds
 */
base.waitForSeconds = (seconds) => {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
}
    
/**
 * Gets the MIME type for a filename
 *
 * @param {String} filename
 *
 * @return {String} MIME type
 */
base.getMIMEType = (filename) => {
    checkParam(filename, 'filename', String);

    if(!filename) { return ''; }
    
    let extension = filename.split('.');
    
    if(extension && extension.length > 0) {
        extension = extension[extension.length - 1];
    } else {
        extension = '';
    }

    extension = extension.split('?')[0];

    switch(extension) {
        // Client types
        case 'css':
            return 'text/css';
        case 'js':
            return 'application/javascript';
            
        // Image types
        case 'jpg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'gif':
            return 'image/gif';
        case 'bmp':
            return 'image/bmp';
        
        // Audio types
        case 'm4a':
            return 'audio/m4a';
        case 'mp3':
            return 'audio/mp3';
        case 'ogg':
            return 'audio/ogg';
        case 'wav':
            return 'audio/wav';
        
        // Video types
        case 'mp4':
            return 'video/mp4';
        case 'webm':
            return 'video/webm';
        case 'avi':
            return 'video/avi';
        case 'mov':
            return 'video/quicktime';
        case 'bmp':
            return 'video/bmp';
        case 'wmv':
            return 'video/x-ms-wmv';
        case '3gp':
            return 'video/3gpp';
        case 'mkv':
            return 'video/x-matroska';

        // Font types
        case 'woff': case 'woff2': case 'ttf':
            return `font/${extension}`;

        // SVG
        case 'svg':
            return 'image/svg+xml';
        
        // PDF
        case 'pdf':
            return 'application/pdf';

        // Everything else
        default:
            return 'application/octet-stream';
    }
}
