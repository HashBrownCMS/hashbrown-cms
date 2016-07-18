'use strict';

let fs = require('fs');
let path = require('path');

class LogHelper {
    /**
     * Gets the date string
     *
     * @returns {String} date
     */
    static getDateString() {
        let date = new Date();

        let output =
            date.getFullYear() + '-' +
            (date.getMonth() + 1) + '-' +
            date.getDate()
        ;

        return output;
    }

    /**
     * Initialises this helper
     */
    static init() {
        if(ProjectHelper.currentProject && ProjectHelper.currentEnvironment) {
            this.wstreamDate = this.getDateString();
            let path = this.getPath() + '/' + this.wstreamDate + '.log';

            if(!fs.existsSync(path)) {
                fs.writeFileSync(path, '');
            }

            this.wstream = fs.createWriteStream(path, {
                flags: 'a',
                defaultEncoding: 'utf8',
                fd: null,
                mode: 0o666,
                autoClose: true
            });
        }
    }

    /**
     * Writes a line to the current log
     *
     * @param {String} line
     */
    static writeLine(line) {
        // If we have a new date, or if the stream hasn't started, reinitialise
        if(!this.wstream || this.wstreamDate != this.getDateString) {
            if(this.wstream) {
                this.wstream.end();
            }
            
            this.init();
        }

        if(this.wstream) {
            this.wstream.write(line + '\n');
        }
    }
    
    /**
     * Makes a directory recursively
     *
     * @param {String} dirPath
     */
    static mkdirRecursively(dirPath) {
        let parents = dirPath.split('/');
        let finalPath = '/';

        for(let i in parents) {
            finalPath += parents[i];

            if(!fs.existsSync(finalPath)) {
                fs.mkdirSync(finalPath);
            }

            if(i < parents.length - 1) {
                finalPath += '/';
            }
        }
    }
    
    /**
     * Gets the log path
     *
     * @returns {String} path
     */
    static getPath() {
        let path = 
            appRoot + 
            '/storage/' +
            ProjectHelper.currentProject + '/' +
            ProjectHelper.currentEnvironment + '/' +
            'logs';

        if(!fs.existsSync(path)) {
            this.mkdirRecursively(path);
        }

        return path;
    }
}

module.exports = LogHelper;
