'use strict';

const FileSystem = require('fs');
const Path = require('path');
const Util = require('util');

const Glob = require('glob');

/**
 * A helper class for handling file system operations
 *
 * @memberof HashBrown.Server.Service
 */
class FileService {
    /**
     * Makes a directory (recursively) if it doesn't exist
     *
     * @param {String} path
     * @param {Number} position
     *
     * @return {Promise} Result
     */
    static makeDirectory(path, position = 0) {
        checkParam(path, 'path', String);
        checkParam(position, 'position', Number);

        let parts = Path.normalize(path).split(Path.sep);
        
        if(position >= parts.length) {   
            return Promise.resolve();
        }
        
        let currentDirPath = parts.slice(0, position + 1).join(Path.sep);
        
        return new Promise((resolve, reject) => {
            if(!currentDirPath || FileSystem.existsSync(currentDirPath)) { return resolve(); }
       
            FileSystem.mkdir(currentDirPath, (err) => {
                if(err) { return reject(err); }

                resolve();
            });
        })
        .then(() => {
            return this.makeDirectory(path, position + 1);
        });
    }

    /**
     * Checks if a file or folder exists
     *
     * @param {String} path
     *
     * @return {Promise} Whether or not the file/folder exists
     */
    static async exists(path) {
        checkParam(path, 'path', String);

        return FileSystem.existsSync(path);
    }

    /**
     * Lists a file or files in a folder
     *
     * @param {String} path
     *
     * @return {Promise} Array of file paths
     */
    static list(path) {
        checkParam(path, 'path', String);

        return new Promise((resolve, reject) => {
            if(path.indexOf('*') > -1) {
                Glob(path, (err, files) => {
                    if(err) { return reject(err); }

                    resolve(files);
                });
            } else {
                FileSystem.lstat(path, (err, stats) => {
                    if(err) { return reject(err); }

                    if(stats.isDirectory()) {
                        FileSystem.readdir(path, (err, files) => {
                            if(err) { return reject(err); }

                            resolve(files);
                        });
                    } else if(stats.isFile()) {
                        resolve([ path ]);
                    } else {
                        reject(new Error('File type for ' + path + ' unknown'));
                    }
                });
            }
        });
    }

    /**
     * Reads a file or files in a folder
     *
     * @param {String} path
     * @param {String} encoding
     *
     * @return {Promise} Buffer or array of buffers
     */
    static read(path, encoding) {
        checkParam(path, 'path', String);

        return this.list(path)
        .then((files) => {
            let buffers = [];

            let readNext = () => {
                let file = files.pop();

                if(!file) { return Promise.resolve(buffers); }

                return new Promise((resolve, reject) => {
                    FileSystem.readFile(file, (err, buffer) => {
                        if(err) { return reject(err); }

                        resolve(buffer);
                    });
                })
                .then((buffer) => {
                    if(encoding) {
                        buffer = buffer.toString(encoding);
                    }

                    buffers.push(buffer);

                    return readNext();
                });
            };
       
            return readNext();
        })
        .then((buffers) => {
            if(!buffers) { return Promise.resolve(null); }

            if(buffers.length === 1) {
                return Promise.resolve(buffers[0]);
            }

            return Promise.resolve(buffers);
        });
    }

    /**
     * Removes a file or folder
     *
     * @param {String} path
     *
     * @return {Promise} Result
     */
    static async remove(path) {
        checkParam(path, 'path', String, true);
     
        try {
            if(FileSystem.lstatSync(path).isDirectory()) {
                for(let filename of await Util.promisify(FileSystem.readdir)(path)) {
                    await this.remove(Path.join(path, filename));
                }
            
                await Util.promisify(FileSystem.rmdir)(path);

            } else {
                await Util.promisify(FileSystem.unlink)(path);

            }
        
        } catch(e) {
            // We don't really mind if a file we're trying to delete isn't there...

        }
    }

    /**
     * Writes a file
     *
     * @param {String|Object} content
     * @param {String} path
     */
    static write(content, path) {
        if(!content) { return Promise.resolve(); }

        checkParam(path, 'path', String);

        // Automatically turn objects into string
        if(content instanceof Buffer === false && content instanceof Object) {
            content = JSON.stringify(content);
        }

        return new Promise((resolve, reject) => {
            FileSystem.writeFile(path, content, (err) => {
                if(err) { return reject(err); }

                resolve();
            });
        });
    }

    /**
     * Moves a file
     *
     * @param {String} from
     * @param {String} to
     *
     * @return {Promise} Result
     */
    static move(from, to) {
        checkParam(from, 'from', String);
        checkParam(to, 'to', String);

        return new Promise((resolve, reject) => {
            FileSystem.rename(from, to, (err) => {
                if(err) { return reject(err); }

                resolve();
            });
        });
    }

    /**
     * Copies a file
     *
     * @param {String} from
     * @param {String} to
     *
     * @return {Promise} Result
     */
    static copy(from, to) {
        checkParam(from, 'from', String);
        checkParam(to, 'to', String);

        return new Promise((resolve, reject) => {
            FileSystem.copyFile(from, to, (err) => {
                if(err) { return reject(err); }

                resolve();
            });
        });
    }
}

module.exports = FileService;
