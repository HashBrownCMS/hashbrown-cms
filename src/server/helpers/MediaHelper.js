'use strict';

// Lib
let glob = require('glob');
let path = require('path');

// Promise
let Promise = require('bluebird');

class MediaHelper {
    /**
     * Gets all Media objects
     *
     * @return {Promise} promise
     */
    static getAllMedia() {
        return new Promise(function(callback) {
            glob(appRoot + '/media/**/*', function(err, paths) {
                let list = [];

                for(let i in paths) {
                    let thisPath = paths[i].replace(appRoot, '')
                    let shortPath = thisPath.replace('/media/', '');

                    list[list.length] = {
                        name: path.basename(shortPath),
                        shortPath: shortPath,
                        path: thisPath,
                        id: 80000 + i
                    };
                }
                                       
                callback(list);
            });
        });
    }
}

module.exports = MediaHelper;
