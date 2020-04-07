'use strict';

const FileSystem = require('fs');
const Path = require('path');
const Util = require('util');
const HTTP = require('http');
const HTTPS = require('https');

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
    static async makeDirectory(path, position = 0) {
        checkParam(path, 'path', String);
        checkParam(position, 'position', Number);

        let parts = Path.normalize(path).split(Path.sep);
        
        if(position >= parts.length) { return; }
        
        let currentDirPath = parts.slice(0, position + 1).join(Path.sep);
        
        await new Promise((resolve, reject) => {
            if(!currentDirPath || FileSystem.existsSync(currentDirPath)) { return resolve(); }
       
            FileSystem.mkdir(currentDirPath, (err) => {
                if(err) { return reject(err); }

                resolve();
            });
        })
            
        await this.makeDirectory(path, position + 1);
    }
    
    /**
     * Checks if a file or folder exists
     *
     * @param {String} path
     *
     * @return {Promise} Whether or not the file/folder exists
     */
    static exists(path) {
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
    static async list(path) {
        checkParam(path, 'path', String);

        return await new Promise((resolve, reject) => {
            if(path.indexOf('*') > -1) {
                Glob(path, (err, files) => {
                    if(err) { return reject(err); }

                    resolve(files);
                });
            } else {
                FileSystem.lstat(path, (err, stats) => {
                    if(err) { return resolve([]); }

                    if(stats.isDirectory()) {
                        FileSystem.readdir(path, (err, files) => {
                            if(err) { return resolve([]); }

                            for(let i in files) {
                                files[i] = Path.join(path, files[i]);
                            }

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
     * Creates a read stream
     *
     * @param {String} path
     *
     * @return {FileSystem.ReadStream} Stream
     */
    static readStream(path) {
        checkParam(path, 'path', String);

        if(!path) { return null; }

        // Stream data from URL
        if(path.indexOf('://') > -1) {
            let url = new URL(path);

            let protocol = url.protocol === 'https:' ? HTTPS : HTTP;
                
            let options = {
                host: url.hostname,
                port: url.port,
                path: url.pathname
            };

            return protocol.get(options);
        }
        
        // Stream data from disk
        return FileSystem.createReadStream(path);
    }

    /**
     * Reads a file or files in a folder
     *
     * @param {String} path
     * @param {String} encoding
     *
     * @return {Buffer|Array} Data
     */
    static async read(path, encoding) {
        checkParam(path, 'path', String, true);

        let files = await this.list(path);

        let buffers = [];

        for(let file of files) {
            let buffer = await new Promise((resolve, reject) => {
                FileSystem.readFile(file, (err, buffer) => {
                    if(err) { return reject(err); }

                    resolve(buffer);
                });
            });

            if(encoding) {
                buffer = buffer.toString(encoding);
            }

            buffers.push(buffer);
        }
  
        if(buffers.length < 1) { return null; }
        if(buffers.length === 1) { return buffers[0]; }

        return buffers;
    }

    /**
     * Checks if a file is a folder
     *
     * @param {String} path
     *
     * @return {Boolean} True/false
     */
    static isDirectory(path) {
        checkParam(path, 'path', String, true);

        try {
            return FileSystem.lstatSync(path).isDirectory();
        
        } catch(e) {
            return false;

        }
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
    static async write(content, path) {
        if(!content) { return; }

        checkParam(path, 'path', String);

        if(content.constructor === Object) {
            content = JSON.stringify(content);
        }

        await new Promise((resolve, reject) => {
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
    static async move(from, to) {
        checkParam(from, 'from', String);
        checkParam(to, 'to', String);

        await new Promise((resolve, reject) => {
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
    static async copy(from, to) {
        checkParam(from, 'from', String);
        checkParam(to, 'to', String);

        await new Promise((resolve, reject) => {
            // Copy from a URL
            if(from.indexOf('://') > -1) {
                let url = new URL(from);

                let options = {
                    host: url.hostname,
                    port: url.port,
                    path: url.pathname
                };

                let file = FileSystem.createWriteStream(to);
                let protocol = from.indexOf('https://') > -1 ? HTTPS : HTTP;

                protocol.get(options, (res) => {
                    res.on('data', (data) => {
                        file.write(data);
                    });

                    res.on('end', () => {
                        file.end();
                        resolve();
                    });

                    res.on('error', (e) => {
                        reject(e);
                    });
                });

            // Copy from a file system path
            } else {
                FileSystem.copyFile(from, to, (err) => {
                    if(err) { return reject(err); }

                    resolve();
                });

            }
        });
    }

    /**
     * Gets file stats
     *
     * @param {String} path
     *
     * @return {Object} Stats
     */
    static async stat(path) {
        return await new Promise((resolve, reject) => {
            FileSystem.stat(path, (err, stats) => {
                if(err) { return resolve(null); }

                resolve(stats);
            });
        });
    }
}

module.exports = FileService;
