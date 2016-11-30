'use strict';

// Libraries
let fs = require('fs');

let restler = require('restler');

// Classes
let ApiController = require('./ApiController');
let Media = require('../models/Media');

class MediaController extends ApiController {
    /**
     * Initiates this controller
     */
    static init(app) {
        app.get('/media/:project/:environment/:id', this.middleware({ authenticate: false }), this.serveMedia);
        
        app.post('/api/:project/:environment/media/new', this.middleware(), MediaHelper.getUploadHandler(), this.createMedia);
        app.get('/api/:project/:environment/media/tree', this.middleware(), this.getMediaTree);
        app.post('/api/:project/:environment/media/tree/:id', this.middleware(), this.setMediaTreeItem);
        app.get('/api/:project/:environment/media/:id', this.middleware(), this.getSingleMedia);
        app.post('/api/:project/:environment/media/:id', this.middleware(), MediaHelper.getUploadHandler(), this.setMedia);
        app.delete('/api/:project/:environment/media/:id', this.middleware(), this.deleteMedia);
        app.get('/api/:project/:environment/media', this.middleware(), this.getMedia);
    }

    /**
     * Gets a Media object by id
     */
    static serveMedia(req, res) {
        let id = req.params.id;

        ConnectionHelper.getMediaProvider()
        .then((connection) => {
            return connection.getMedia(id);
        })
        .then((media) => {
            if(media) {
                let contentType = media.getContentTypeHeader();
                
                if(media.isLocal) {
                    res.sendFile(media.url);
                
                } else 

                // TODO: Replace this temporary hack with an actual file service
                // The problem here is that SVG content is received fine through binary representation, but actual binary content isn't
                if(contentType != 'image/svg+xml') {
                    res.redirect(media.url);

                } else {
                    restler.get(media.url, {
                        headers: {
                            'Accept': contentType 
                        }
                    })
                    .on('success', (data, response) => {
                        res.header('Content-Type', contentType);

                        res.status(200).end(data, 'binary');
                    })
                    .on('fail', (data, response) => {
                        res.status(404).send(response);   
                    });
                }
            } else {
                res.status(404).send('Not found');
            }
        })
        .catch((e) => {
            res.status(404).end(e.message);  
        });
    }
    
    /**
     * Gets the Media tree
     */
    static getMediaTree(req, res) {
        MediaHelper.getTree()
        .then((tree) => {
            res.status(200).send(tree);
        })
        .catch((e) => {
            res.status(404).send([]);
            debug.log(e, ApiController);
        });            
    }
    
    /**
     * Sets a Media tree item
     */
    static setMediaTreeItem(req, res) {
        let id = req.params.id;
        let item = req.body;

        MediaHelper.setTreeItem(id, item)
        .then(() => {
            res.status(200).send(item);
        })
        .catch((e) => {
            res.status(502).send(e);
            debug.log(e, ApiController);
        });            
    }
    
    /**
     * Gets a list of Media objects
     */
    static getMedia(req, res) {
        let media;
        let tree;

        ConnectionHelper.getMediaProvider()
        .then((connection) => {
            return connection.getAllMedia();
        })
        .then((result) => {
            media = result;

            return MediaHelper.getTree();
        })
        .then((result) => {
            let tree = result;

            for(let i in media) {
                media[i].applyFolderFromTree(tree);  
            }

            res.status(200).send(media);
        })
        .catch((e) => {
            res.status(404).send(ApiController.printError(e));    
        });            
    }
    
    /**
     * Gets a single Media object
     */
    static getSingleMedia(req, res) {
        let id = req.params.id;
        let media;
        let tree;

        ConnectionHelper.getMediaProvider()
        .then((connection) => {
            return connection.getMedia(id);
        })
        .then((result) => {
            media = result;

            return MediaHelper.getTree();
        })
        .then((result) => {
            tree = result;

            media.applyFolderFromTree(tree);

            res.status(200).send(media);
        })
        .catch((e) => {
            debug.log(e, MediaController);
            res.status(404).send(e.message);    
        });            
    }
    
    /**
     * Deletes a Media object
     */
    static deleteMedia(req, res) {
        let id = req.params.id;

        ConnectionHelper.getMediaProvider()
        .then((connection) => {
            return connection.removeMedia(id);
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch((e) => {
            res.status(404).send(e.message);
            debug.warning(e, MediaController);
        });            
    }

    /**
     * Sets a Media object
     */
    static setMedia(req, res) {
        let file = req.file;
        let id = req.params.id;

        if(file) {
            ConnectionHelper.getMediaProvider()
            .then((connection) => {
                return connection.setMedia(id, file);
            })
            .then(() => {
                // Remove temp file
                if(fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }

                // Return the id
                res.send(id);
            })            
            .catch((e) => {
                debug.warning(e.message);
                res.status(400).send(MediaController.printError(e));
            });            

        } else {
            debug.warning(e.message);
            res.status(400).send(MediaController.printError(e));
        }
    }

    /**
     * Creates a Media object
     */
    static createMedia(req, res) {
        let file = req.file;

        if(file) {
            let media = Media.create();

            ConnectionHelper.getMediaProvider()
            .then((connection) => {
                return connection.setMedia(media.id, file);
            })
            .then(() => {
                res.status(200).send(media.id);
            })
            .catch((e) => {
                debug.warning(e);
                res.status(400).send(MediaController.printError(e));    
            });

        } else {
            debug.warning('File was not provided', MediaController);
            res.status(400).send('File was not provided');    
        }
    }
}

module.exports = MediaController;
