'use strict';

const Path = require('path');

/**
 * The helper class for plugins
 *
 * @memberof HashBrown.Server.Service
 */
class PluginService {
    /**
     * Initialises all plugins located at /plugins/:name
     */
    static async init() {
        let namespaces = {
            Controller: {
                ApiController: {}
            },
            Entity: {
                Deployer: {},
                Processor: {},
                Resource: {}
            },
            Service: {}
        };

        let path = Path.join(APP_ROOT, 'plugins');
        let folders = await HashBrown.Service.FileService.list(path);

        for(let plugin of folders) {
            if(!HashBrown.Service.FileService.isDirectory(Path.join(path, plugin))) { continue; }

            await this.initNamespaces(plugin, namespaces);
        }
    }

    /**
     * Initialises a list of folders recursively
     *
     * @param {String} plugin
     * @param {Object} namespaces
     * @param {String} currentNamespace
     */
    static async initNamespaces(plugin, namespaces, currentNamespace = '') {
        checkParam(plugin, 'plugin', String, true);
        checkParam(namespaces, 'namespaces', Object, true);
        checkParam(currentNamespace, 'currentNamespace', String);
            
        for(let partialNamespace in namespaces) {
            let folderPath = Path.join(APP_ROOT, 'plugins', plugin, 'src', 'Server', currentNamespace.replace(/\./g, '/'), partialNamespace);
            let fullNamespace = (currentNamespace ? currentNamespace + '.' : '') + partialNamespace;
            
            let files = await HashBrown.Service.FileService.list(folderPath);
                
            for(let filePath of files) {
                filePath = Path.join(folderPath, filePath);

                if(Path.extname(filePath) !== '.js') { continue; }

                namespace(fullNamespace)
                .add(require(filePath));
            }
            
            let subnamespaces = namespaces[partialNamespace];

            await this.initNamespaces(plugin, subnamespaces, fullNamespace);
        }
    }
}

module.exports = PluginService;
