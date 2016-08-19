'use strict';

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
            connection.getMedia(id)
            .then((media) => {
                if(media) {
                    res.redirect(media.url);
                } else {
                    res.status(404).send('Not found');
                }
            })
            .catch((e) => {
                res.status(400).end(e.message);  
            });
        })
        .catch((e) => {
            res.status(400).end(e.message);  
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
        ConnectionHelper.getMediaProvider()
        .then((connection) => {
            connection.getAllMedia()
            .then((media) => {
                MediaHelper.getTree()
                .then((tree) => {
                    for(let i in media) {
                        media[i].applyFolderFromTree(tree);  
                    }

                    res.status(200).send(media);
                })
                .catch((e) => {
                    debug.log(e, ApiController);
                    res.status(404).send([]);
                });
            })
            .catch((e) => {
                debug.log(e, ApiController);
                res.status(404).send([]);    
            });            
        })
        .catch((e) => {
            debug.log(e, ApiController);
            res.status(404).send([]);    
        });            
    }
    
    /**
     * Gets a single Media object
     */
    static getSingleMedia(req, res) {
        let id = req.params.id;

        ConnectionHelper.getMediaProvider()
        .then((connection) => {
            connection.getMedia(id)
            .then((media) => {
                MediaHelper.getTree()
                .then((tree) => {
                    media.applyFolderFromTree(tree);

                    res.status(200).send(media);
                })
                .catch((e) => {
                    debug.log(e, ApiController);
                    res.status(404).send(e.message);    
                });            
            })
            .catch((e) => {
                debug.log(e, ApiController);
                res.status(404).send(e.message);    
            });            
        })            
        .catch((e) => {
            debug.log(e, ApiController);
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
            connection.removeMedia(id)
            .then(() => {
                res.sendStatus(200);
            })
            .catch((e) => {
                res.status(404).send(e);    
            });            
        })            
        .catch((e) => {
            res.status(404).send(e);
            debug.warning(e, ApiController);
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
                connection.setMedia(id, file)
                .then(() => {
                    // Remove temp file
                    fs.unlinkSync(file.path);

                    // Return the id
                    res.send(id);
                })
                .catch((e) => {
                    debug.warning(e);
                    res.status(400).send(e);
                });            
            })            
            .catch((e) => {
                debug.warning(e);
                res.status(400).send(e);
            });            

        } else {
            debug.warning(e);
            res.status(400).send(e);
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
                    connection.setMedia(media.id, file)
                        .then(() => {
                            res.status(200).send(media.id);
                        })
                    .catch((e) => {
                        debug.warning(e);
                        res.status(400).send(e);    
                    });
                })            
            .catch((e) => {
                debug.warning(e);
                res.status(400).send(e);    
            });

        } else {
            debug.warning(e);
            res.status(400).send(e);    
        }
    }
}

module.exports = MediaController;
