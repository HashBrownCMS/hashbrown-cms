'use strict';

// Libs
let fs = require('fs');

// Models
let Media = require('../models/Media');
let Content = require('../models/Content');

// Classes
let Controller = require('./Controller');

/**
 * The main API controller
 */
class ApiController extends Controller {
    /**
     * Initialises this controller
     */
    static init(app) {
        // Content
        app.get('/api/:project/:environment/content', ApiController.getAllContents);
        app.get('/api/:project/:environment/content/:id', ApiController.getContent);
        app.post('/api/:project/:environment/content/new', ApiController.createContent);
        app.post('/api/:project/:environment/content/publish', ApiController.publishContent);
        app.post('/api/:project/:environment/content/unpublish', ApiController.unpublishContent);
        app.post('/api/:project/:environment/content/:id', ApiController.postContent);
        app.delete('/api/:project/:environment/content/:id', ApiController.deleteContent);

        // Schemas
        app.post('/api/:project/:environment/schemas/new', ApiController.createSchema);
        app.get('/api/:project/:environment/schemas', ApiController.getSchemas);
        app.get('/api/:project/:environment/schemas/:id', ApiController.getSchema);
        app.post('/api/:project/:environment/schemas/:id', ApiController.setSchema);
        app.delete('/api/:project/:environment/schemas/:id', ApiController.deleteSchema);
        
        // Connections
        app.get('/api/:project/:environment/connections', ApiController.getConnections);
        app.get('/api/:project/:environment/connections/:id', ApiController.getConnection);
        app.post('/api/:project/:environment/connections/new', ApiController.createConnection);
        app.post('/api/:project/:environment/connections/:id', ApiController.postConnection);
        app.delete('/api/:project/:environment/connections/:id', ApiController.deleteConnection);
            
        // Settings
        app.get('/api/:project/:environment/settings/:section', ApiController.getSettings);
        app.post('/api/:project/:environment/settings/:section', ApiController.setSettings);

        // User
        app.post('/api/user/login', ApiController.login);
        app.get('/api/user/scopes', ApiController.getScopes);
        app.get('/api/users', ApiController.getUsers);
        app.post('/api/user/new', ApiController.createUser);
        app.post('/api/user/:id', ApiController.postUser);

        // Templates
        app.get('/api/:project/:environment/templates', ApiController.getTemplates)
        app.get('/api/:project/:environment/sectionTemplates', ApiController.getSectionTemplates)
        
        // Media
        app.post('/api/:project/:environment/media/new', MediaHelper.getUploadHandler(), ApiController.createMedia);
        app.get('/api/:project/:environment/media/tree', ApiController.getMediaTree);
        app.post('/api/:project/:environment/media/tree/:id', ApiController.setMediaTreeItem);
        app.get('/api/:project/:environment/media/:id', ApiController.getSingleMedia);
        app.post('/api/:project/:environment/media/:id', MediaHelper.getUploadHandler(), ApiController.setMedia);
        app.delete('/api/:project/:environment/media/:id', ApiController.deleteMedia);
        app.get('/api/:project/:environment/media', ApiController.getMedia);
    }
 
    // ----------
    // Content methods
    // ---------- 
    /**
     * Gets a list of all Content objects
     */
    static getAllContents(req, res) {
        ApiController.authenticate(req, res)
        .then(() => {
            ContentHelper.getAllContents()
            .then(function(nodes) {
                res.send(nodes);
            });
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }

    /**
     * Gets a Content object by id
     *
     * @return {Object} Content
     */
    static getContent(req, res) {
        ApiController.authenticate(req, res)
        .then(() => {
            let id = req.params.id;
       
            if(id && id != 'undefined') {
                ContentHelper.getContentById(id)
                .then(function(node) {
                    res.send(node);
                });
            
            } else {
                throw '[Api] Content id is undefined';
            
            }
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }
    
    /**
     * Creates a new Content object
     *
     * @return {Content} content
     */
    static createContent(req, res) {
        ApiController.authenticate(req, res)
        .then(() => {
            ContentHelper.createContent()
            .then(function(node) {
                res.send(node);
            });
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }

    /**
     * Posts a Content object by id
     */
    static postContent(req, res) {
        ApiController.authenticate(req, res)
        .then(() => {
            let id = req.params.id;
            let node = req.body;
            
            ContentHelper.setContentById(id, node)
            .then(function() {
                res.sendStatus(200);
            });
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }
   
    /**
     * Publishes a Content node
     */
    static publishContent(req, res) {
        ApiController.authenticate(req, res)
        .then(() => {
            let content = new Content(req.body);

            ConnectionHelper.publishContent(content)
            .then(function() {
                res.sendStatus(200);
            });
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }
    
    /**
     * Unpublishes a Content node
     */
    static unpublishContent(req, res) {
        ApiController.authenticate(req, res)
        .then(() => {
            let content = new Content(req.body);

            ConnectionHelper.unpublishContent(content)
            .then(function() {
                res.sendStatus(200);
            });
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }

    /**
     * Deletes a Content object by id
     */
    static deleteContent(req, res) {
        ApiController.authenticate(req, res)
        .then(() => {
            let id = req.params.id;
            
            ContentHelper.removeContentById(id)
            .then(function() {
                res.sendStatus(200);
            });
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }
    
    // ----------
    // Connection methods
    // ----------
    /**
     * Gets all connections
     */
    static getConnections(req, res) {
        ApiController.authenticate(req, res)
        .then(() => {
            ConnectionHelper.getAllConnections()
            .then(function(connections) {
                res.send(connections);
            });
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }

    /**
     * Post connection by id
     */
    static postConnection(req, res) {
        ApiController.authenticate(req, res, 'connections')
        .then(() => {
            let id = req.params.id;
            let content = req.body;

            ConnectionHelper.setConnectionById(id, content)
            .then(function(connections) {
                res.sendStatus(200);
            });
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }
    
    /**
     * Gets a connection by id
     */
    static getConnection(req, res) {
        ApiController.authenticate(req, res)
        .then(() => {
            let id = req.params.id;
       
            if(id && id != 'undefined') {
                ConnectionHelper.getConnectionById(id)
                .then(function(node) {
                    res.send(node);
                });
            
            } else {
                throw '[Api] Connection id is undefined';
            
            }
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }
    
    /**
     * Creates a new connection
     *
     * @return {Object} Content
     */
    static createConnection(req, res) {
        ApiController.authenticate(req, res, 'connections')
        .then(() => {
            ConnectionHelper.createConnection()
            .then(function(node) {
                res.send(node);
            });
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }

    /**
     * Deletes a connection by id
     */
    static deleteConnection(req, res) {
        ApiController.authenticate(req, res, 'connections')
        .then(() => {
            let id = req.params.id;
            
            ConnectionHelper.removeConnectionById(id)
            .then(function() {
                res.sendStatus(200);
            });
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }
    
    // ----------
    // Schema methods
    // ---------- 
    /**
     * Get a list of all Schemas
     */
    static getSchemas(req, res) {
        ApiController.authenticate(req, res)
        .then(() => {
            SchemaHelper.getAllSchemas()
            .then(function(schemas) {
                res.send(schemas);
            });
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }
    
    /**
     * Get a Schema by id
     */
    static getSchema(req, res) {
        ApiController.authenticate(req, res)
        .then(() => {
            let id = req.params.id;

            SchemaHelper.getSchema(id)
            .then(function(schema) {
                res.send(schema);
            });
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }
    
    /**
     * Set a Schema by id
     */
    static setSchema(req, res) {
        ApiController.authenticate(req, res, 'schemas')
        .then(() => {
            let id = req.params.id;
            let schema = req.body;

            SchemaHelper.setSchema(id, schema)
            .then(function() {
                res.sendStatus(200);
            });
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }
    
    /**
     * Creates a new Schema
     */
    static createSchema(req, res) {
        let parentSchema = req.body;

        ApiController.authenticate(req, res, 'schemas')
        .then(() => {
            SchemaHelper.createSchema(parentSchema)
            .then(function(newSchema) {
                res.send(newSchema.getFields());
            });
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }
    
    /**
     * Deletes a Schema by id
     */
    static deleteSchema(req, res) {
        ApiController.authenticate(req, res, 'schemas')
        .then(() => {
            let id = req.params.id;
            
            SchemaHelper.removeSchema(id)
            .then(function() {
                res.sendStatus(200);
            });
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }
    
    // ----------
    // Settings
    // ----------
    /**
     * Get settings object
     */
    static getSettings(req, res) {
        ApiController.authenticate(req, res)
        .then(() => {
            SettingsHelper.getSettings(req.params.section)
            .then(function(settings) {
                res.send(settings);
            });
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }
    
    /**
     * Set settings object
     */
    static setSettings(req, res) {
        ApiController.authenticate(req, res, 'settings')
        .then(() => {
            let settings = req.body;

            SettingsHelper.setSettings(req.params.section, settings)
            .then(function() {
                res.sendStatus(200);
            });
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }

    // ----------
    // User
    // ----------
    /**
     * Authenticates an API call
     *
     * @param {Request} req
     * @param {Response} res
     * @param {String} scope
     */
    static authenticate(req, res, scope) {
        return new Promise((resolve, reject) => {
            let token = req.query.token;

            if(req.params.project && req.params.environment) {
                ProjectHelper.currentProject = req.params.project;
                ProjectHelper.currentEnvironment = req.params.environment;
            }

            UserHelper.findToken(token)
            .then((user) => {
                if(user) {
                    // If a scope is defined, check for it
                    if(scope) {
                        if(user.hasScope(ProjectHelper.currentProject, scope)) {
                            resolve(user);
                
                        } else {
                            reject(new Error('User with token "' + token + '" doesn\'t have scope "' + scope + '"'));

                        }
                   
                    // If no scope is required, return as normal 
                    } else {
                        resolve(user);

                    }

                } else {
                    reject(new Error('Found no user with token "' + token + '"'));
                }
            });
        });
    }

    /** 
     * Logs in a user
     */
    static login(req, res) {
        let username = req.body.username;
        let password = req.body.password;

        UserHelper.loginUser(username, password)
        .then((token) => {
            res.send(token);
        })
        .catch((e) => {
            res.sendStatus(403);   
        });
    }

    /**
     * Get current scopes
     */
    static getScopes(req, res) {
        ApiController.authenticate(req, res)
        .then((user) => {
            res.send(user.scopes);
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }
    
    /**
     * Get all users
     */
    static getUsers(req, res) {
        ApiController.authenticate(req, res, 'users')
        .then((user) => {
            UserHelper.getAllUsers()
            .then((users) => {
                res.send(users);
            });
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }

    /**
     * Updates a user
     */
    static postUser(req, res) {
        ApiController.authenticate(req, res, 'users')
        .then(() => {
            let username = req.params.username;
            let user = req.body;

            UserHelper.updateUser(username, user)
            .then(() => {
                res.sendStatus(200);
            });
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }
    
    /**
     * Creates a user
     */
    static createUser(req, res) {
        ApiController.authenticate(req, res, 'users')
        .then(() => {
            let username = req.body.username;
            let password = req.body.password;

            UserHelper.createUser(username, password)
            .then(() => {
                res.sendStatus(200);
            });
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }

    // ----------
    // Templates
    // ----------
    /**
     * Gets an array of all templates
     */
    static getTemplates(req, res) {
        ApiController.authenticate(req, res)
        .then(() => {
            ConnectionHelper.getTemplateProvider()
            .then((connection) => {
                connection.getTemplates()
                .then((templates) => {
                    res.send(templates);
                });
            })
            .catch((e) => {
                res.send([]);
            });            
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }
    
    /**
     * Gets an array of all section templates
     */
    static getSectionTemplates(req, res) {
        ApiController.authenticate(req, res)
        .then(() => {
            ConnectionHelper.getTemplateProvider()
            .then((connection) => {
                connection.getSectionTemplates()
                .then((templates) => {
                    res.send(templates);
                });
            })
            .catch((e) => {
                res.send([]);
            });            
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }
    
    // ----------
    // Media methods
    // ---------- 
    /**
     * Gets the Media tree
     */
    static getMediaTree(req, res) {
        ApiController.authenticate(req, res)
        .then(() => {
            MediaHelper.getTree()
            .then((tree) => {
                res.send(tree);
            })
            .catch((e) => {
                res.send([]);
                debug.log(e, ApiController);
            });            
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }
    
    /**
     * Sets a Media tree item
     */
    static setMediaTreeItem(req, res) {
        let id = req.params.id;
        let item = req.body;

        ApiController.authenticate(req, res)
        .then(() => {
            MediaHelper.setTreeItem(id, item)
            .then(() => {
                res.sendStatus(200);
            })
            .catch((e) => {
                res.sendStatus(400);
                debug.log(e, ApiController);
            });            
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }
    
    /**
     * Gets a list of Media objects
     */
    static getMedia(req, res) {
        ApiController.authenticate(req, res)
        .then(() => {
            ConnectionHelper.getMediaProvider()
            .then((connection) => {
                connection.getAllMedia()
                .then((media) => {
                    MediaHelper.getTree()
                    .then((tree) => {
                        for(let i in media) {
                            media[i].applyFolderFromTree(tree);  
                        }

                        res.send(media);
                    })
                    .catch((e) => {
                        debug.log(e, ApiController);
                        res.send([]);
                    });
                })
                .catch((e) => {
                    debug.log(e, ApiController);
                    res.send([]);    
                });            
            })
            .catch((e) => {
                debug.log(e, ApiController);
                res.send([]);    
            });            
        })
        .catch((e) => {
            debug.log(e, ApiController);
            res.sendStatus(403);   
        });
    }
    
    /**
     * Gets a single Media object
     */
    static getSingleMedia(req, res) {
        ApiController.authenticate(req, res)
        .then(() => {
            let id = req.params.id;

            ConnectionHelper.getMediaProvider()
            .then((connection) => {
                connection.getMedia(id)
                .then((media) => {
                    res.send(media);
                })
                .catch((e) => {
                    res.send(null);    
                });            
            })            
            .catch((e) => {
                res.send(null);    
            });            
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }
    
    /**
     * Deletes a Media object
     */
    static deleteMedia(req, res) {
        ApiController.authenticate(req, res)
        .then(() => {
            let id = req.params.id;

            ConnectionHelper.getMediaProvider()
            .then((connection) => {
                connection.removeMedia(id)
                .then(() => {
                    res.sendStatus(200);
                })
                .catch((e) => {
                    res.sendStatus(404);    
                });            
            })            
            .catch((e) => {
                debug.warning(e);
                res.sendStatus(400);    
            });            
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }

    /**
     * Sets a Media object
     */
    static setMedia(req, res) {
        ApiController.authenticate(req, res)
        .then(() => {
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
                        res.sendStatus(400);    
                    });            
                })            
                .catch((e) => {
                    debug.warning(e);
                    res.sendStatus(400);    
                });            

            } else {
                debug.warning(e);
                res.sendStatus(400);
            }
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }

    /**
     * Creates a Media object
     */
    static createMedia(req, res) {
        ApiController.authenticate(req, res)
            .then(() => {
                let file = req.file;

                if(file) {
                    let media = Media.create();

                    ConnectionHelper.getMediaProvider()
                        .then((connection) => {
                            connection.setMedia(media.id, file)
                                .then(() => {
                                    fs.unlinkSync(file.path);

                                    res.send(media.id);
                                })
                            .catch((e) => {
                                debug.warning(e);
                                res.sendStatus(400);    
                            });
                        })            
                    .catch((e) => {
                        debug.warning(e);
                        res.sendStatus(400);    
                    });

                } else {
                    debug.warning(e);
                    res.sendStatus(400);    
            }
        })
        .catch((e) => {
            res.sendStatus(403);   
            debug.log(e, ApiController);
        });
    }
}

module.exports = ApiController;
