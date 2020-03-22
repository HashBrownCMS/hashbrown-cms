'use strict';

const ChildProcess = require('child_process');
const FileSystem = require('fs');
const Path = require('path');

/**
 * The main class for basic app operations
 *
 * @memberof HashBrown.Server.Service
 */
class AppService {
    /**
     * Executes a console command
     *
     * @param {String} cmd
     * @param {String} cwd
     *
     * @returns {Promise} Result
     */
    static exec(cmd, cwd = '') {
        checkParam(cmd, 'cmd', String);
        checkParam(cwd, 'cwd', String);

        if(!cwd) { cwd = APP_ROOT; }

        return new Promise((resolve, reject) => {
            let process = ChildProcess.exec(cmd, { cwd: cwd });
            let result = '';
            let message = '';

            process.stdout.on('data', (data) => {
                result += data;
            });

            process.stderr.on('data', (data) => {
                message += data;
            });

            process.on('exit', (code) => {
                if(code === 0 || code === '0') {
                    resolve(result);
                } else {
                    reject(new Error('Process "' + cmd + '" in "' + cwd + '" exited with code ' + code + ': ' + message));
                }
            });
        });
    }
    
    /**
     * Gets a list of available themes
     *
     * @return {Array} Themes
     */
    static async getThemes() {
        let files = await HashBrown.Service.FileService.list(Path.join(APP_ROOT, 'theme'));
        let themes = [];

        for(let file of files) {
            if(Path.extname(file) !== '.css') { continue; }

            themes.push(Path.basename(file, '.css'));
        }

        let pluginThemes = await HashBrown.Service.PluginService.getThemes();

        themes = themes.concat(pluginThemes);

        return themes;
    }
}

module.exports = AppService;
