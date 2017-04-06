'use strict';

// Libraries
let fs = require('fs');

// Classes
let ApiController = require('./ApiController');
let Media = require('../models/Media');

class MediaController extends ApiController {
    /**
     * Initiates this controller
     */
    static init(app) {
        app.get('/media/:project/:environment/:id', this.middleware({ authenticate: false }), this.serveMedia);
        
        app.get('/api/:project/:environment/media/tree', this.middleware(), this.getMediaTree);
        app.get('/api/:project/:environment/media/:id', this.middleware(), this.getSingleMedia);
        app.get('/api/:project/:environment/media', this.middleware(), this.getMedia);
        
        app.post('/api/:project/:environment/media/new', this.middleware(), MediaHelper.getUploadHandler(), this.createMedia);
        app.post('/api/:project/:environment/media/tree/:id', this.middleware(), this.setMediaTreeItem);
        app.post('/api/:project/:environment/media/:id', this.middleware(), MediaHelper.getUploadHandler(), this.setMedia);
        app.post('/api/:project/:environment/media/replace/:id', this.middleware(), MediaHelper.getUploadHandler(true), this.setMedia);
        
        app.delete('/api/:project/:environment/media/:id', this.middleware(), this.deleteMedia);
    }

    /**
     * Gets a Media object by id
     */
    static serveMedia(req, res) {
        let id = req.params.id;

        ConnectionHelper.getMediaProvider(req.project, req.environment)
        .then((connection) => {
            return connection.getMedia(id);
        })
        .then((media) => {
            if(media) {
                let contentType = media.getContentTypeHeader();
                
                if(!media.remote) {
                    res.sendFile(media.url);
               
                // Piping the data through would be a more elegant solution, but ultimately more work for the server
                // The remote source might also have unpredictable headers, so it's best to let the remote handle content delivery etirely
                } else {
                    res.redirect(media.url);
                
                }
            } else {
                res.status(404).send('Not found');
            }
        })
        .catch((e) => {
            res.status(404).end(ApiController.printError(e, false));  
        });
    }
    
    /**
     * Gets the Media tree
     */
    static getMediaTree(req, res) {
        MediaHelper.getTree(req.project, req.environment)
        .then((tree) => {
            res.status(200).send(tree);
        })
        .catch((e) => {
            res.status(404).send(ApiController.printError(e));
        });            
    }
    
    /**
     * Sets a Media tree item
     */
    static setMediaTreeItem(req, res) {
        let id = req.params.id;
        let item = req.body;

        MediaHelper.setTreeItem(req.project, req.environment, id, item)
        .then(() => {
            res.status(200).send(item);
        })
        .catch((e) => {
            res.status(502).send(ApiController.printError(e));
        });            
    }
    
    /**
     * Gets a list of Media objects
     */
    static getMedia(req, res) {
        let media;
        let tree;

        ConnectionHelper.getMediaProvider(req.project, req.environment)
        .then((connection) => {
            return connection.getAllMedia();
        })
        .then((result) => {
            media = result;

            return MediaHelper.getTree(req.project, req.environment);
        })
        .then((result) => {
            let tree = result;

            for(let i in media) {
                media[i].applyFolderFromTree(tree);  
            }

            res.status(200).send(media);
        })
        .catch((e) => {
            res.status(404).send(ApiController.printError(e, false));    
        });            
    }
    
    /**
     * Gets a single Media object
     */
    static getSingleMedia(req, res) {
        let id = req.params.id;
        let media;
        let tree;

        ConnectionHelper.getMediaProvider(req.project, req.environment)
        .then((connection) => {
            return connection.getMedia(id);
        })
        .then((result) => {
            media = result;

            return MediaHelper.getTree(req.project, req.environment);
        })
        .then((result) => {
            tree = result;

            media.applyFolderFromTree(tree);

            res.status(200).send(media);
        })
        .catch((e) => {
            res.status(404).send(ApiController.printError(e));    
        });            
    }
    
    /**
     * Deletes a Media object
     */
    static deleteMedia(req, res) {
        let id = req.params.id;

        ConnectionHelper.getMediaProvider(req.project, req.environment)
        .then((connection) => {
            return connection.removeMedia(id);
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch((e) => {
            res.status(404).send(ApiController.printError(e));
        });            
    }

    /**
     * Sets a Media object
     */
    static setMedia(req, res) {
        let file = req.file;
        let files = req.files;
        let id = req.params.id;

        if(!file && files && files.length > 0) {
            file = files[0];
        }

        if(file) {

            ConnectionHelper.getMediaProvider(req.project, req.environment)
            .then((connection) => {
                return connection.setMedia(id, file);
            })
            .then(() => {
                // Remove temp file
                if(fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
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
     * Creates a Media object
     */
    static createMedia(req, res) {
        let files = req.files;

        if(files) {
            let ids = [];

            let next = () => {
                let file = files.pop();

                if(!file) {
                    return Promise.resolve();
                }

                let media = Media.create();

                return ConnectionHelper.getMediaProvider(req.project, req.environment)
                .then((connection) => {
                    return connection.setMedia(media.id, file);
                })
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
            debug.warning('File was not provided', MediaController);
            res.status(400).send('File was not provided');    
        }
    }
}

module.exports = MediaController;
