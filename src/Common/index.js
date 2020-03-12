'use strict';

let base;

if(typeof window !== 'undefined') {
    base = window;
} else if(typeof global !== 'undefined') {
    base = global;
}

if(!base) {
    throw new Error('Base not found');
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
    
    if(notNull && (value === null || value === '')) {
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
    checkParam(filename, 'filename', String, true);
    
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
