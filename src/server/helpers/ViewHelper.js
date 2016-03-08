'use strict';

let Promise = require('bluebird');

let fs = require('fs');

/**
 * A helper class for views
 */
class ViewHelper {

    /**
     * Gets all view files
     *
     * @param {String} subfolder
     *
     * @return {Promise} promise
     */
    static getAllViews(subfolder) {
        return new Promise(function(callback) {
            fs.readdir(appRoot + '/views/' + subfolder, function(err, names) {
                if(err) {
                    throw err;
                }
                
                names = names.filter(function(file) {
                    return file.substr(-5) === '.jade';
                });

                let queue = names || [];
                let views = {};

                if(queue.length > 0) {
                    function readNextView() {
                        let name = queue[0];

                        fs.readFile(appRoot + '/views/' + subfolder + '/' + name, 'utf8', function(err, data) {
                            if(err) {
                                throw err;
                            }

                            // Add the loaded view to the output array
                            views[name.replace('.jade', '')] = data;

                            // Shift the queue (removes the first element of the array)
                            queue.shift();

                            // If the queue still has items in it, we should continue reading...
                            if(queue.length > 0) {
                                readNextView();

                            // ...if not, we'll return all the loaded views
                            } else {
                                callback(views);
                            
                            }
                        });
                    }

                    readNextView();

                } else {
                    callback([]);

                }
            });
        });
    }
}

module.exports = ViewHelper;
