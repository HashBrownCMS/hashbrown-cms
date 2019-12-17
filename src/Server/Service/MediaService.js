'use strict';

const Path = require('path');
const FileSystem = require('fs');
const Multer = require('multer');

const WATCH_CACHE_INTERVAL = 1000 * 60; // One minute
const MAX_CACHE_TIME = 1000 * 60 * 60 * 24 * 10 // 10 days

/**
 * The helper class for Media
 *
 * @memberof HashBrown.Server.Service
 */
class MediaService extends require('Common/Service/MediaService') {
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
     * Gets the upload handler
     *
     * @return {Function} Handler
     */
    static getUploadHandler() {
        let handler = Multer({
            storage: Multer.diskStorage({
                destination: async (req, file, resolve) => {
                    let path = Path.join(APP_ROOT, 'storage', req.project, 'temp');
                  
                    await HashBrown.Service.FileService.makeDirectory(path);
                    
                    resolve(null, path);
                },
                filename: (req, file, resolve) => {
                    let split = file.originalname.split('.');
                    let name = split[0];
                    let extension = split[1];
                    
                    name = name.replace(/\W+/g, '-').toLowerCase();
                   
                    if(extension) {
                        name += '.' + extension;
                    }

                    resolve(null, name);
                }
            })
        })
       
        return handler.array('media', 100);
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
    static async renameMedia(project, environment, id, name) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);
        checkParam(name, 'name', String);

        let provider = await HashBrown.Service.ConnectionService.getMediaProvider(project, environment);

        if(!provider) { throw new Error('No connection assigned as media provider'); }

        await provider.renameMedia(id, name);
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
       
        return HashBrown.Service.SyncService.getResource(project, environment, 'media/tree')
        .then((tree) => {
            if(!tree || tree.length < 1) {
                return HashBrown.Service.DatabaseService.find(project, environment + '.media', {});
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

        return HashBrown.Service.SyncService.setResourceItem(project, environment, 'media/tree', id, item)
        .then((wasItemSet) => {
            if(wasItemSet) { return Promise.resolve(); }        

            // Remove the item if it's null
            if(!item) {
                return HashBrown.Service.DatabaseService.removeOne(
                    project,
                    environment + '.media',
                    {
                        id: id
                    }
                );

            // If it's not, update the database document
            } else {
                item.id = id;

                return HashBrown.Service.DatabaseService.updateOne(
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
    static async cleanCache() {
        let files = await HashBrown.Service.FileService.list(Path.join(APP_ROOT, 'storage', '*', 'cache', '*'));

        for(let file of files) {
            let stats = await HashBrown.Service.FileService.stat(file);

            if(new Date().getTime() - new Date(stats.atime).getTime() > MAX_CACHE_TIME) {
                await HashBrown.Service.FileService.remove(file);
            }
        }
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

        let files = await HashBrown.Service.FileService.list(cacheFolder);

        for(let file of files) {
            if(file.indexOf(id) < 0) { continue; }

            await HashBrown.Service.FileService.remove(Path.join(cacheFolder, file));
        }
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
        checkParam(media, 'media', HashBrown.Entity.Resource.Media);
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
        await HashBrown.Service.FileService.makeDirectory(cacheFolder);

        let data = null;
       
        // Read the data
        try {
            data = await HashBrown.Service.FileService.read(cachedPath);
        
        // File wasn't found, copy it
        } catch(e) {
            if(!media.path) {
                throw new Error(`Cannot fetch media "${media.id}", no url or path specified`);
            }

            await HashBrown.Service.FileService.copy(media.path, cachedPath);

            // Resize file
            if(width && media.isImage() && !media.isSvg()) { 
                await HashBrown.Service.AppService.exec('convert ' + cachedPath + ' -resize ' + width + (height ? 'x' + height : '') + '\\> ' + cachedPath);
            }
            
            // Read file
            data = await HashBrown.Service.FileService.read(cachedPath);
        }

        return data;
    }
}

module.exports = MediaService;
