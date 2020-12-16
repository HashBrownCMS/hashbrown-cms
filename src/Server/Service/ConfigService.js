'use strict';

const FileSystem = require('fs');
const Path = require('path');

// We don't want to be querying the file system every time
let cache = {};

/**
 * A helper class for reading and writing config files
 *
 * @memberof HashBrown.Server.Service
 */
class ConfigService {
    /**
     * Sets a config section
     *
     * @param {String} name
     * @param {Object} config
     */
    static async set(name, config) {
        checkParam(name, 'name', String, true);
        checkParam(config, 'config', Object, true);
            
        let path = Path.join(APP_ROOT, 'config', name + '.cfg');

        await HashBrown.Service.FileService.write(path, JSON.stringify(config));

        delete cache[name];
    }
    
    /**
     * Gets whether a config section exists
     *
     * @param {String} name
     *
     * @return {Boolean} Config section exists
     */
    static exists(name) {
        checkParam(name, 'name', String, true);
       
        let path = Path.join(APP_ROOT, 'config', name + '.cfg');

        return HashBrown.Service.FileService.exists(path);
    }
    
    /**
     * Gets a particular config section
     *
     * @param {String} name
     *
     * @returns {Object} Config object
     */
    static async get(name = '') {
        checkParam(name, 'name', String);
       
        if(!name) {
            let all = {};
            let configPath = Path.join(APP_ROOT, 'config');
            let files = await HashBrown.Service.FileService.list(configPath);

            for(let file of files) {
                if(Path.extname(file) !== '.cfg') { continue; }

                let configName = Path.basename(file, '.cfg');

                if(!configName) { continue; }

                all[configName] = await this.get(configName);
            }

            if(!all.system) { all.system = {}; }
            if(!all.database) { all.database = {}; }

            return all;
        }

        if(cache[name]) { return cache[name]; }

        let path = Path.join(APP_ROOT, 'config', name + '.cfg');
        let data = await HashBrown.Service.FileService.read(path);

        try {
            data = JSON.parse(data);
        
        } catch(e) {
            data = null;

        }

        if(!data) { return {}; }
    
        // Validate root URL
        if(name === 'system' && data.rootUrl) {
            data.rootUrl = '/' + data.rootUrl.split('/').filter(Boolean).join('/');
        }
        
        cache[name] = data;

        return data;
    }
    
    /**
     * Gets a particular config section synchronously
     * This method throws away all error messages
     *
     * @param {String} name
     *
     * @returns {Object} Config object
     */
    static getSync(name) {
        checkParam(name, 'name', String, true);
       
        if(cache[name]) { return cache[name]; }

        let path = Path.join(APP_ROOT, 'config', name + '.cfg');

        if(!HashBrown.Service.FileService.exists(path)) { return {}; }

        let data = FileSystem.readFileSync(path);

        try {
            data = JSON.parse(data);

        } catch(e) {
            data = null;

        }
        
        if(!data) { return {}; }

        cache[name] = data;

        return data;
    }
}

module.exports = ConfigService;
