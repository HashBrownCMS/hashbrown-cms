'use strict';

const FileSystem = require('fs');

/**
 * The Media controller
 *
 * @memberof HashBrown.Server.Controllers
 */
class MediaController extends require('./ApiController') {
    /**
     * Initiates this controller
     */
    static init(app) {
        app.get('/media/:project/:environment/:id', this.middleware({ authenticate: false }), this.serveMedia);
        
        app.get('/api/:project/:environment/media/tree', this.middleware(), this.getMediaTree);
        app.get('/api/:project/:environment/media/:id', this.middleware(), this.getSingleMedia);
        app.get('/api/:project/:environment/media', this.middleware(), this.getMedia);
        
        app.post('/api/:project/:environment/media/new', this.middleware(), HashBrown.Helpers.MediaHelper.getUploadHandler(), this.createMedia);
        app.post('/api/:project/:environment/media/tree/:id', this.middleware(), this.setMediaTreeItem);
        app.post('/api/:project/:environment/media/:id', this.middleware(), HashBrown.Helpers.MediaHelper.getUploadHandler(), this.setMedia);
        app.post('/api/:project/:environment/media/replace/:id', this.middleware(), HashBrown.Helpers.MediaHelper.getUploadHandler(true), this.setMedia);
        
        app.delete('/api/:project/:environment/media/:id', this.middleware(), this.deleteMedia);
    }

    /**
     * Serves Media content
     */
    static serveMedia(req, res) {
        let id = req.params.id;

        HashBrown.Helpers.ConnectionHelper.getMediaProvider(req.project, req.environment)
        .then((connection) => {
            return connection.getMedia(id)
            .then((media) => {
                if(!media) {
                    return res.status(404).send('Not found');
                }

                // Serve local files directly
                if(!media.url) {
                    res.sendFile(media.path);

                // Serve remote files through redirection
                // NOTE: Piping the data through would be a more elegant solution, but ultimately more work for the server
                // NOTE: The remote source might also have unpredictable headers, so it's best to let the remote handle content delivery entirely
                } else {
                    res.redirect(media.url);
                }
            });
        })
        .catch((e) => {
            res.status(404).end(MediaController.printError(e, false));  
        });
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
    static getMediaTree(req, res) {
        HashBrown.Helpers.MediaHelper.getTree(req.project, req.environment)
        .then((tree) => {
            res.status(200).send(tree);
        })
        .catch((e) => {
            res.status(404).send(MediaController.printError(e));
        });            
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
    static setMediaTreeItem(req, res) {
        let id = req.params.id;
        let item = req.body;

        HashBrown.Helpers.MediaHelper.setTreeItem(req.project, req.environment, id, item)
        .then(() => {
            res.status(200).send(item);
        })
        .catch((e) => {
            res.status(502).send(MediaController.printError(e));
        });            
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
    static getMedia(req, res) {
        let media;
        let tree;

        HashBrown.Helpers.ConnectionHelper.getMediaProvider(req.project, req.environment)
        .then((connection) => {
            return connection.getAllMedia();
        })
        .then((result) => {
            media = result;

            return HashBrown.Helpers.MediaHelper.getTree(req.project, req.environment);
        })
        .then((result) => {
            let tree = result;

            for(let i in media) {
                media[i].applyFolderFromTree(tree);  
            }

            res.status(200).send(media);
        })
        .catch((e) => {
            res.status(404).send(MediaController.printError(e, false));    
        });            
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
    static getSingleMedia(req, res) {
        let id = req.params.id;

        HashBrown.Helpers.ConnectionHelper.getMediaProvider(req.project, req.environment)
        .then((connection) => {
            return connection.getMedia(id)
            .then((media) => {
                if(!media) {
                    return Promise.reject(new Error('Connection "' + connection.id + '" failed to fetch media "' + id + '"'));
                }

                return HashBrown.Helpers.MediaHelper.getTree(req.project, req.environment)
                .then((tree) => {
                    media.applyFolderFromTree(tree);

                    res.status(200).send(media);
                })
            })
        })
        .catch((e) => {
            res.status(404).send(MediaController.printError(e));    
        });            
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
    static deleteMedia(req, res) {
        let id = req.params.id;

        HashBrown.Helpers.ConnectionHelper.getMediaProvider(req.project, req.environment)
        .then((connection) => {
            return connection.removeMedia(id);
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch((e) => {
            res.status(404).send(MediaController.printError(e));
        });            
    }

    /**
     * @example GET /api/:project/:environment/media/:id
     *
     * @apiGroup Media
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @param {FileData} files Binary Media data
     */
    static setMedia(req, res) {
        let file = req.file;
        let files = req.files;
        let id = req.params.id;

        if(!file && files && files.length > 0) {
            file = files[0];
        }

        if(file) {
            HashBrown.Helpers.ConnectionHelper.getMediaProvider(req.project, req.environment)
            .then((connection) => {
                return HashBrown.Helpers.MediaHelper.uploadFromTemp(req.project, req.environment, id, file.path)
            })
            .then(() => {
                // Remove temp file
                if(FileSystem.existsSync(file.path)) {
                    FileSystem.unlinkSync(file.path);
                }

                // Return the id
                res.status(200).send(id);
            })            
            .catch((e) => {
                res.status(400).send(MediaController.printError(e));
            });            

        } else {
            res.status(400).send(MediaController.printError(new Error('File was null')));
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
    static createMedia(req, res) {
        let files = req.files || [ req.file ];

        if(files && files.length > 0) {
            let ids = [];

            let next = () => {
                let file = files.pop();

                if(!file) {
                    return Promise.resolve();
                }
                
                let media = HashBrown.Models.Media.create();

                return HashBrown.Helpers.MediaHelper.uploadFromTemp(req.project, req.environment, media.id, file.path)
                .then(() => {
                    ids.push(media.id);
                    
                    return next();
                });
            };

            next()
            .then(() => {
                res.status(200).send(ids);
            })
            .catch((e) => {
                res.status(400).send(MediaController.printError(e));    
            });

        } else {
            res.status(400).send('File was not provided');    
        }
    }
}

module.exports = MediaController;
