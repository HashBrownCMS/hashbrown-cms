'use strict';

const Path = require('path');
const FileSystem = require('fs');

const MediaHelperCommon = require('Common/Helpers/MediaHelper');

const WATCH_CACHE_INTERVAL = 1000 * 60; // One minute
const MAX_CACHE_TIME = 1000 * 60 * 60 * 24 * 10 // 10 days

/**
 * The helper class for Media
 *
 * @memberof HashBrown.Server.Helpers
 */
class MediaHelper extends MediaHelperCommon {
    /**
     * Start watching cache
     */
    static startWatchingCache() {
        setInterval(() => {
            this.cleanCache();
        }, WATCH_CACHE_INTERVAL);

        this.cleanCache();
    }
    
    /**
     * Renames a Media object
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     * @param {String} name
     *
     * @return {Promise} Promise
     */
    static renameMedia(project, environment, id, name) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);
        checkParam(name, 'name', String);

        // Get Media provider
        return HashBrown.Helpers.ConnectionHelper.getMediaProvider(project, environment)
        .then((provider) => {
            return provider.renameMedia(id, name);
        });
    }
    
    /**
     * Gets the Media tree
     *
     * NOTE: This method, as opposed to most other resource methods, does not merge
     * local and remote resources since it would be too complicated in the end
     *
     * @param {String} project
     * @param {String} environment
     *
     * @return {Promise} Tree
     */
    static getTree(project, environment) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

        let collection = environment + '.media';
       
        return HashBrown.Helpers.SyncHelper.getResource(project, environment, 'media/tree')
        .then((tree) => {
            if(!tree || tree.length < 1) {
                return HashBrown.Helpers.DatabaseHelper.find(project, environment + '.media', {});
            }

            return Promise.resolve(tree);   
        })
        .then((tree) => {
            // Make sure there is a root folder
            tree.unshift({folder: '/', id: '*'});

            // Path sanity check
            for(let item of tree) {
                item.folder = item.folder || '/'; 

                // Append initial slash
                if(item.folder.indexOf('/') !== 0) {
                    item.folder = '/' + item.folder;
                }

                // Append end slash
                item.folder = item.folder + '/';

                // Replace all double slashes with a single slash
                item.folder = item.folder.replace(/\/+/g, '/');
            }

            return Promise.resolve(tree);
        });
    }
    
    /**
     * Sets a Media tree parent
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     * @param {Object} item
     *
     * @return {Promise} promise
     */
    static setTreeItem(project, environment, id, item) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);
        checkParam(item, 'item', Object);

        return HashBrown.Helpers.SyncHelper.setResourceItem(project, environment, 'media/tree', id, item)
        .then((wasItemSet) => {
            if(wasItemSet) { return Promise.resolve(); }        

            // Remove the item if it's null
            if(!item) {
                return HashBrown.Helpers.DatabaseHelper.removeOne(
                    project,
                    environment + '.media',
                    {
                        id: id
                    }
                );

            // If it's not, update the database document
            } else {
                item.id = id;

                return HashBrown.Helpers.DatabaseHelper.updateOne(
                    project,
                    environment + '.media',
                    {
                        id: id
                    },
                    item,
                    {
                        upsert: true
                    }
                );
            }
        })
    }

    /**
     * Cleans the Media cache
     */
    static cleanCache() {
        let storageFolder = Path.join(APP_ROOT, 'storage');
       
        if(!FileSystem.existsSync(storageFolder)) { return; }

        FileSystem.readdir(storageFolder, (err, folders) => {
            if(err) { return; }
        
            for(let folder of folders) { 
                let cacheFolder = Path.join(storageFolder, folder, 'cache');

                if(!FileSystem.existsSync(cacheFolder)) { continue; }

                FileSystem.readdir(cacheFolder, (err, files) => {
                    if(err) { return; }
                    
                    for(let file of files) {
                        let cachedFile = Path.join(cacheFolder, file);

                        FileSystem.stat(cachedFile, (err, stats) => {
                            if(err) { return; }

                            if(new Date().getTime() - new Date(stats.atime).getTime() > MAX_CACHE_TIME) {
                                FileSystem.unlink(cachedFile, (err) => { });
                            }
                        });
                    }
                });
            }
        });
    }

    /**
     * Removes a cached version of a Media object
     *
     * @param {String} project
     * @param {String} id
     */
    static async removeCachedMedia(project, id) {
        checkParam(project, 'project', String);
        checkParam(id, 'id', String);

        let cacheFolder = Path.join(APP_ROOT, 'storage', project, 'cache');
        let cachedPath = Path.join(cacheFolder, id);
     
        HashBrown.Helpers.FileHelper.remove(cachedPath + '*');
    }


    /**
     * Gets a cached version of a Media object
     *
     * @param {String} project
     * @param {Media} media
     * @param {Number} width
     * @param {Number} height
     *
     * @returns {Promise} Media
     */
    static async getCachedMedia(project, media, width, height = 0) {
        checkParam(project, 'project', String);
        checkParam(media, 'media', HashBrown.Models.Media);
        checkParam(width, 'width', Number, true);
        checkParam(height, 'height', Number);

        let cacheFolder = Path.join(APP_ROOT, 'storage', project, 'cache');
        let cachedPath = Path.join(cacheFolder, media.id);
        
        if(width) {
            cachedPath += '_' + width;
        }
        
        if(height) {
            cachedPath += 'x' + height;
        }

        // Create the cache folder, if it doesn't exist
        await HashBrown.Helpers.FileHelper.makeDirectory(cacheFolder);

        let data = null;
       
        // Read the data
        try {
            data = await HashBrown.Helpers.FileHelper.read(cachedPath);
        
        // File wasn't found, copy it
        } catch(e) {
            // Download with web request
            if(media.url) {
                await HashBrown.Helpers.RequestHelper.download(media.url, cachedPath);

            // Copy from file system
            } else {
                await HashBrown.Helpers.FileHelper.copy(media.path, cachedPath);
            
            }

            // Resize file
            if(width && media.isImage() && !media.isSvg()) { 
                await HashBrown.Helpers.AppHelper.exec('convert ' + cachedPath + ' -resize ' + width + (height ? 'x' + height : '') + '\\> ' + cachedPath);
            }
            
            // Read file
            data = await HashBrown.Helpers.FileHelper.read(cachedPath);
        }

        return data;
    }
}

module.exports = MediaHelper;
