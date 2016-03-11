'use strict';

// Lib
let glob = require('glob');
let fs = require('fs');

// Promise
let Promise = require('bluebird');

class ScriptHelper {
    /**
     * Gets a list of scripts
     *
     * @param {String} pattern
     * @param {Boolean} concatenate
     */
    static getAllScripts(pattern, concatenate) {
        return new Promise(function(callback) {
            glob(appRoot + '/scripts' + pattern, function(err, paths) {
                if(err) {
                    throw err;
                }

                let queue = paths || [];
                let scripts = [];
                let concatenated = '';

                if(queue.length > 0) {
                    function readNextScript() {
                        let scriptPath = queue[0];

                        fs.readFile(scriptPath, 'utf8', function(err, script) {
                            if(err) {
                                throw err;
                            }

                            if(concatenate) {
                                // Concatenate the loaded script
                                concatenated += script;
                            } else {
                                // Add the loaded script to the output array
                                scripts[scripts.length] = script;
                            }

                            // Shift the queue (removes the first element of the array)
                            queue.shift();

                            // If the queue still has items in it, we should continue reading...
                            if(queue.length > 0) {
                                readNextScript();

                            // ...if not, we'll return all the loaded scripts
                            } else {
                                callback(concatenate ? concatenated : scripts);
                            
                            }
                        });
                    }

                    readNextScript();

                } else {
                    callback(concatenate ? '' : []);

                }
            });
        });
    }
}

module.exports = ScriptHelper;
