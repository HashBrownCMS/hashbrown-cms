'use strict';

const FileSystem = require('fs');

// TODO: Make these GIT submodules
const Multer = require('multer');

/**
 * The Media controller
 *
 * @memberof HashBrown.Server.Controllers
 */
class MediaController extends HashBrown.Controllers.ApiController {
    /**
     * Initiates this controller
     */
    static init(app) {
        app.get('/media/:project/:environment/:id', this.middleware({ authenticate: false }), this.serve);
        
        app.get('/api/:project/:environment/media/tree', this.middleware(), this.getTree);
        app.get('/api/:project/:environment/media/:id', this.middleware(), this.get);
        app.get('/api/:project/:environment/media', this.middleware(), this.getAll);
        
        app.post('/api/:project/:environment/media/new', this.middleware(), this.upload(), this.new);
        app.post('/api/:project/:environment/media/tree/:id', this.middleware(), this.setTree);
        app.post('/api/:project/:environment/media/:id', this.middleware(), this.upload(), this.set);
        app.post('/api/:project/:environment/media/rename/:id', this.middleware(), this.rename);
        app.post('/api/:project/:environment/media/replace/:id', this.middleware(), this.upload(true), this.set);
        
        app.delete('/api/:project/:environment/media/:id', this.middleware(), this.remove);
    }
    
    /**
     * Uploads a file from temp storage
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     * @param {String} tempPath
     *
     * @returns {Promise} Result
     */
    static uploadFromTemp(project, environment, id, tempPath) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);
        checkParam(tempPath, 'tempPath', String);

        let connection;
        let filename = Path.basename(tempPath);

        // Get Media provider
        return HashBrown.Helpers.ConnectionHelper.getMediaProvider(project, environment)
        .then((provider) => {
            connection = provider;

            // Read the file from temp
            debug.log('Reading file from temp dir ' + tempPath + '...', this);

            return new Promise((resolve, reject)  => {
                FileSystem.readFile(tempPath, (err, fileData) => {
                    if(err) { return reject(err); }

                    resolve(fileData);
                });
            });
        })
        .then((fileData) => {
            // Upload the data
            debug.log('Uploading file...', this);
            
            return connection.setMedia(id, filename, fileData.toString('base64'));
        })
        .then(() => {
            // Remove the file from temp storage
            debug.log('Removing temp file...', this);
            
            return new Promise((resolve, reject)  => {
                FileSystem.unlink(tempPath, (err) => {
                    resolve();
                });
            });
        });
    }


    /**
     * Serves Media content
     */
    static async serve(req, res) {
        let id = req.params.id;

        if(id.indexOf('?') > -1) {
            id = id.substring(0, id.indexOf('?'));
        }

        try {
            let connection = await HashBrown.Helpers.ConnectionHelper.getMediaProvider(req.project, req.environment);
            let media = await connection.getMedia(id);

            if(!media || (!media.url && !media.path)) {
                return res.status(404).send('Not found');
            }
            
            let data = await HashBrown.Helpers.MediaHelper.getCachedMedia(req.project, media, parseInt(req.query.width), parseInt(req.query.height));
            
            res.writeHead(200, {'Content-Type': media.getContentTypeHeader()});
            res.end(data);

        } catch(e) {
            res.status(404).end(MediaController.printError(e, false)); 
        }
    }
    
    /**
     * Gets the upload handler
     *
     * @param {Boolean} isSingleFile
     *
     * @return {Function} handler
     */
    static upload(isSingleFile) {
        let handler = Multer({
            storage: Multer.diskStorage({
                destination: async (req, file, resolve) => {
                    let path = Path.join(APP_ROOT, 'storage', req.params.project, 'temp');
                   
                    debug.log('Handling file upload to temp storage...', this);

                    await HashBrown.Helpers.FileHelper.makeDirectory(path);
                    
                    resolve(null, path);
                },
                filename: (req, file, resolve) => {
                    resolve(null, file.originalname);
                }
            })
        })
       
        if(isSingleFile) {
            return handler.single('media');
        } else {
            return handler.array('media', 100);
        }
    }

    /**
     * @example GET /api/:project/:environment/media/tree
     *
     * @apiGroup Media
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Object} Media tree
     */
    static async getTree(req, res) {
        try {
            let tree = await HashBrown.Helpers.MediaHelper.getTree(req.project, req.environment);
            
            res.status(200).send(tree);
        
        } catch(e) {
            res.status(404).send(MediaController.printError(e));
        
        }     
    }
    
    /**
     * @example POST /api/:project/:environment/media/tree/:id
     *
     * @apiGroup Media
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     
     * @param {Object} item
     *
     * @returns {Object} Media tree item
     */
    static async setTree(req, res) {
        let id = req.params.id;
        let item = req.body;

        try {
            await HashBrown.Helpers.MediaHelper.setTreeItem(req.project, req.environment, id, item);
            
            res.status(200).send(item);
        
        } catch(e) {
            res.status(502).send(MediaController.printError(e));
        
        }
    }
    
    /**
     * @example GET /api/:project/:environment/media
     *
     * @apiGroup Media
     *
     * @param {String} project
     * @param {String} environment
     
     * @returns {Array} All Media nodes
     */
    static async getAll(req, res) {
        try {
            let connection = await HashBrown.Helpers.ConnectionHelper.getMediaProvider(req.project, req.environment);

            if(!connection) { return []; }

            let media = await connection.getAllMedia();
                
            let tree = await HashBrown.Helpers.MediaHelper.getTree(req.project, req.environment);

            for(let i in media) {
                media[i].applyFolderFromTree(tree);  
            }

            res.status(200).send(media);
        
        } catch(e) {
            res.status(404).send(MediaController.printError(e, false));    
        
        }
    }
    
    /**
     * @example GET /api/:project/:environment/media/:id
     *
     * @apiGroup Media
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     
     * @returns {Media} Media
     */
    static async get(req, res) {
        try {
            let id = req.params.id;

            let connection = await HashBrown.Helpers.ConnectionHelper.getMediaProvider(req.project, req.environment);

            let media = await connection.getMedia(id);
            
            if(!media) {
                throw new Error('Connection "' + connection.id + '" failed to fetch media "' + id + '"');
            }

            let tree = await HashBrown.Helpers.MediaHelper.getTree(req.project, req.environment);

            media.applyFolderFromTree(tree);

            res.status(200).send(media);
        
        } catch(e) {
            res.status(404).send(MediaController.printError(e));    
        
        }     
    }
    
    /**
     * @example DELETE /api/:project/:environment/media/:id
     *
     * @apiGroup Media
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     */
    static async remove(req, res) {
        try {
            let id = req.params.id;

            await HashBrown.Helpers.MediaHelper.removeCachedMedia(req.project, id);

            let connection = await HashBrown.Helpers.ConnectionHelper.getMediaProvider(req.project, req.environment);

            await connection.removeMedia(id);
            
            res.sendStatus(200);
        
        } catch(e) {
            res.status(404).send(MediaController.printError(e));
        
        }    
    }
    
    /**
     * @example POST /api/:project/:environment/media/rename/:id
     *
     * @apiGroup Media
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     * @param {String} name
     */
    static async rename(req, res) {
        try {
            let id = req.params.id;
            let name = req.query.name;

            await HashBrown.Helpers.MediaHelper.renameMedia(req.project, req.environment, id, name);
            
            res.status(200).send(id);

        } catch(e) {
            res.status(400).send(MediaController.printError(e));
        
        }
    }
    
    /**
     * @example POST /api/:project/:environment/media/:id
     *
     * @apiGroup Media
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @param {FileData} Binary Media data
     */
    static async set(req, res) {
        try {
            let file = req.file;
            let files = req.files;
            let id = req.params.id;

            if(!file && files && files.length > 0) {
                file = files[0];
            }

            if(!file) { throw new Error('File was null'); }

            await HashBrown.Helpers.MediaHelper.removeCachedMedia(req.project, id);

            await this.uploadFromTemp(req.project, req.environment, id, file.path);
            
            res.status(200).send(id);

        } catch(e) {
            res.status(500).send(MediaController.printError(e));    

        }
    }

    /**
     * @example GET /api/:project/:environment/media/new
     *
     * @apiGroup Media
     *
     * @param {String} project
     * @param {String} environment
     *
     * @param {FileData} files Binary Media data
     *
     * @returns {String} Created Media id
     */
    static async new(req, res) {
        try {
            let files = req.files || [ req.file ];

            if(!files || files.length < 1) { throw new Error('File was not provided'); }

            let ids = [];

            for(let file of files) {
                let media = HashBrown.Models.Media.create();

                await this.uploadFromTemp(req.project, req.environment, media.id, file.path)
                
                ids.push(media.id);
            }

            res.status(200).send(ids);
        
        } catch(e) {
            res.status(500).send(MediaController.printError(e));    
        
        }
    }
}

module.exports = MediaController;
