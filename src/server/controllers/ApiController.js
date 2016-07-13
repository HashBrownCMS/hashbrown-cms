'use strict';

// Libs
let fs = require('fs');
let bodyparser = require('body-parser');
let pathToRegexp = require('path-to-regexp');

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
     * Authenticates an API call
     *
     * @param {String} token
     * @param {String} scope
     */
    static authenticate(token, scope) {
        return new Promise((resolve, reject) => {
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
     * Sets project variables
     * 
     * @param {String} url
     */
    static setProjectVariables(url) {
        return new Promise((resolve, reject) => {
            let keys = [];
            let re = pathToRegexp('/api/:project/:environment/*', keys);
            let values = re.exec(url);
            let project;
            let environment;

            if(values) {
                // The first array item is the entire url, so remove it
                values.shift();

                for(let i in keys) {
                    let key = keys[i];

                    switch(key.name) {
                        case 'project':
                            project = values[i];
                            break;

                        case 'environment':
                            environment = values[i];
                            break;
                    }
                }
            }

            // We have both project and environment, we'll set them as current
            if(project && environment) {
                ProjectHelper.setCurrent(project, environment)
                .then(resolve)
                .catch(reject);
            
            // The parameters weren't provided, so just move on
            } else {
                resolve();

            }
        });
    }
        
    /**
     * Middleware
     *
     * @param {Object} settings
     */
    static middleware(settings) {
        settings = settings || {};

        return function middleware(req, res, next) {
            ApiController.authenticate(req.query.token, settings.scope)
            .then(() => {
                if(settings.setProject != false) {
                    ApiController.setProjectVariables(req.originalUrl)
                    .then(next)
                    .catch((e) => {
                        res.status(400).send(e);
                        debug.log(e, ApiController);
                    });
                } else {
                    next();
                }
            })
            .catch((e) => {
                res.status(403).send(e);   
                debug.log(e, ApiController);
            });    
        }
    }

    /**
     * Initialises this controller
     */
    static init(app) {
        // Server
        app.get('/api/server/projects', ApiController.getAllProjects);
        app.get('/api/server/:project/environments', ApiController.getAllEnvironments);
        
        // User
        app.post('/api/user/login', ApiController.login);
        app.get('/api/user/scopes', ApiController.getScopes);
        app.get('/api/users', ApiController.middleware({scope: 'users', setProject: false}), ApiController.getUsers);
        app.post('/api/user/new', ApiController.middleware({scope: 'users', setProject: false}), ApiController.createUser);
        app.post('/api/user/:id', ApiController.middleware({scope: 'users', setProject: false}), ApiController.postUser);
        
        // Content
        app.get('/api/:project/:environment/content', ApiController.middleware(), ApiController.getAllContents);
        app.get('/api/:project/:environment/content/:id', ApiController.middleware(), ApiController.getContent);
        app.post('/api/:project/:environment/content/new', ApiController.middleware(), ApiController.createContent);
        app.post('/api/:project/:environment/content/publish', ApiController.middleware(), ApiController.publishContent);
        app.post('/api/:project/:environment/content/unpublish', ApiController.middleware(), ApiController.unpublishContent);
        app.post('/api/:project/:environment/content/:id', ApiController.middleware(), ApiController.postContent);
        app.delete('/api/:project/:environment/content/:id', ApiController.middleware(), ApiController.deleteContent);

        // Schemas
        app.post('/api/:project/:environment/schemas/new', ApiController.middleware({scope: 'schemas'}), ApiController.createSchema);
        app.get('/api/:project/:environment/schemas', ApiController.middleware(), ApiController.getSchemas);
        app.get('/api/:project/:environment/schemas/:id', ApiController.middleware(), ApiController.getSchema);
        app.post('/api/:project/:environment/schemas/:id', ApiController.middleware({scope: 'schemas'}), ApiController.setSchema);
        app.delete('/api/:project/:environment/schemas/:id', ApiController.middleware({scope: 'schemas'}), ApiController.deleteSchema);
        
        // Connections
        app.get('/api/:project/:environment/connections', ApiController.middleware(), ApiController.getConnections);
        app.get('/api/:project/:environment/connections/:id', ApiController.middleware(), ApiController.getConnection);
        app.post('/api/:project/:environment/connections/new', ApiController.middleware({scope: 'connections'}), ApiController.createConnection);
        app.post('/api/:project/:environment/connections/:id', ApiController.middleware({scope: 'connections'}), ApiController.postConnection);
        app.delete('/api/:project/:environment/connections/:id', ApiController.middleware({scope: 'connections'}), ApiController.deleteConnection);
            
        // Settings
        app.get('/api/:project/:environment/settings/:section', ApiController.middleware(), ApiController.getSettings);
        app.post('/api/:project/:environment/settings/:section', ApiController.middleware({scope: 'settings'}), ApiController.setSettings);

        // Templates
        app.get('/api/:project/:environment/templates', ApiController.middleware(), ApiController.getTemplates)
        app.get('/api/:project/:environment/sectionTemplates', ApiController.middleware(), ApiController.getSectionTemplates)
        
        // Media
        app.post('/api/:project/:environment/media/new', MediaHelper.getUploadHandler(), ApiController.middleware(), ApiController.createMedia);
        app.get('/api/:project/:environment/media/tree', ApiController.middleware(), ApiController.getMediaTree);
        app.post('/api/:project/:environment/media/tree/:id', ApiController.middleware(), ApiController.setMediaTreeItem);
        app.get('/api/:project/:environment/media/:id', ApiController.middleware(), ApiController.getSingleMedia);
        app.post('/api/:project/:environment/media/:id', MediaHelper.getUploadHandler(), ApiController.middleware(), ApiController.setMedia);
        app.delete('/api/:project/:environment/media/:id', ApiController.middleware(), ApiController.deleteMedia);
        app.get('/api/:project/:environment/media', ApiController.middleware(), ApiController.getMedia);
    }
 
    // ----------
    // Server methods
    // ---------- 
    /**
     * Gets a list of all projects
     */
    static getAllProjects(req, res) {
        ProjectHelper.getAllProjects()
        .then((projects) => {
            res.send(projects);
        })
        .catch((e) => {
            res.status(502).send(e);
        });
    }
    
    /**
     * Gets a list of all environments
     */
    static getAllEnvironments(req, res) {
        let project = req.params.project;

        ProjectHelper.getAllEnvironments(project)
        .then((environments) => {
            res.send(environments);
        })
        .catch((e) => {
            res.status(502).send(e);
        });
    }
    
    
    // ----------
    // Content methods
    // ---------- 
    /**
     * Gets a list of all Content objects
     */
    static getAllContents(req, res) {
        ContentHelper.getAllContents()
        .then(function(nodes) {
            res.send(nodes);
        })
        .catch((e) => {
            res.status(502).send(e);
        });
    }

    /**
     * Gets a Content object by id
     *
     * @return {Object} Content
     */
    static getContent(req, res) {
        let id = req.params.id;
   
        if(id && id != 'undefined') {
            ContentHelper.getContentById(id)
            .then(function(node) {
                res.status(200).send(node);
            })
            .catch((e) => {
                res.status(502).send(e);
            });
        
        } else {
            res.status(402).send('Content id is undefined');

        }
    }
    
    /**
     * Creates a new Content object
     *
     * @return {Content} content
     */
    static createContent(req, res) {
        ContentHelper.createContent()
        .then((node) => {
            res.status(200).send(node);
        })
        .catch((e) => {
            res.status(502).send(e);
        });
    }

    /**
     * Posts a Content object by id
     */
    static postContent(req, res) {
        let id = req.params.id;
        let node = req.body;
        
        ContentHelper.setContentById(id, node)
        .then(() => {
            res.status(200).send(node);
        })
        .catch((e) => {
            res.status(502).send(e);   
        });
    }
   
    /**
     * Publishes a Content node
     */
    static publishContent(req, res) {
        let content = new Content(req.body);

        ConnectionHelper.publishContent(content)
        .then(() => {
            res.status(200).send(req.body);
        })
        .catch((e) => {
            res.status(502).send(e);   
        });
    }
    
    /**
     * Unpublishes a Content node
     */
    static unpublishContent(req, res) {
        let content = new Content(req.body);

        ConnectionHelper.unpublishContent(content)
        .then(() => {
            res.status(200).send(content);
        })
        .catch((e) => {
            res.status(502).send(e);
        });
    }

    /**
     * Deletes a Content object by id
     */
    static deleteContent(req, res) {
        let id = req.params.id;
        
        ContentHelper.removeContentById(id)
        .then(() => {
            res.status(200).send(id);
        })
        .catch((e) => {
            res.status(502).send(e);
        });
    }
    
    // ----------
    // Connection methods
    // ----------
    /**
     * Gets all connections
     */
    static getConnections(req, res) {
        ConnectionHelper.getAllConnections()
        .then((connections) => {
            res.send(connections);
        })
        .catch((e) => {
            res.status(502).send(e);
        });
    }

    /**
     * Post connection by id
     */
    static postConnection(req, res) {
        let id = req.params.id;
        let connection = req.body;

        ConnectionHelper.setConnectionById(id, connection)
        .then(() => {
            res.status(200).send(connection);
        })
        .catch((e) => {
            res.status(502).send(e);
        });
    }
    
    /**
     * Gets a connection by id
     */
    static getConnection(req, res) {
        let id = req.params.id;
   
        if(id && id != 'undefined') {
            ConnectionHelper.getConnectionById(id)
            .then((connection) => {
                res.send(connection);
            })
            .catch((e) => {
                res.status(502).send(e);
            });
        
        } else {
            res.status(400).send('Connection id is not provided');
        
        }
    }
    
    /**
     * Creates a new connection
     *
     * @return {Object} Content
     */
    static createConnection(req, res) {
        ConnectionHelper.createConnection()
        .then((connection) => {
            res.status(200).send(connection);
        })
        .catch((e) => {
            res.status(502).send(e);
        });
    }

    /**
     * Deletes a connection by id
     */
    static deleteConnection(req, res) {
        let id = req.params.id;
        
        ConnectionHelper.removeConnectionById(id)
        .then(() => {
            res.status(200).send(id);
        })
        .catch((e) => {
            res.status(502).send(e);
        });
    }
    
    // ----------
    // Schema methods
    // ---------- 
    /**
     * Get a list of all Schemas
     */
    static getSchemas(req, res) {
        SchemaHelper.getAllSchemas()
        .then((schemas) => {
            res.status(200).send(schemas);
        })
        .catch((e) => {
            res.status(502).send(e);
        });
    }
    
    /**
     * Get a Schema by id
     */
    static getSchema(req, res) {
        let id = req.params.id;

        SchemaHelper.getSchema(id)
        .then((schema) => {
            res.status(200).send(schema);
        })
        .catch((e) => {
            res.status(502).send(e);
        });
    }
    
    /**
     * Set a Schema by id
     */
    static setSchema(req, res) {
        let id = req.params.id;
        let schema = req.body;

        SchemaHelper.setSchema(id, schema)
        .then(() => {
            res.status(200).send(schema);
        })
        .catch((e) => {
            res.status(502).send(e);
        });
    }
    
    /**
     * Creates a new Schema
     */
    static createSchema(req, res) {
        let parentSchema = req.body;

        SchemaHelper.createSchema(parentSchema)
        .then((newSchema) => {
            res.status(200).send(newSchema.getObject());
        })
        .catch((e) => {
            res.status(502).send(e);
        });
    }
    
    /**
     * Deletes a Schema by id
     */
    static deleteSchema(req, res) {
        let id = req.params.id;
        
        SchemaHelper.removeSchema(id)
        .then(() => {
            res.status(200).send(id);
        })
        .catch((e) => {
            res.status(502).send(e);
        });
    }
    
    // ----------
    // Settings
    // ----------
    /**
     * Get settings object
     */
    static getSettings(req, res) {
        SettingsHelper.getSettings(req.params.section)
        .then((settings) => {
            res.status(200).send(settings);
        })
        .catch((e) => {
            res.status(502).send(e);
        });
    }
    
    /**
     * Set settings object
     */
    static setSettings(req, res) {
        let settings = req.body;

        SettingsHelper.setSettings(req.params.section, settings)
        .then(() => {
            res.status(200).send(settings);
        })
        .catch((e) => {
            res.status(502).send(e);
        });
    }

    // ----------
    // User
    // ----------
    /** 
     * Logs in a user
     */
    static login(req, res) {
        let username = req.body.username;
        let password = req.body.password;

        debug.log('Attempting login for user "' + username + '"...', UserHelper);

        UserHelper.loginUser(username, password)
        .then((token) => {
            res.status(200).send(token);
        })
        .catch((e) => {
            res.status(403).send(e);   
        });
    }

    /**
     * Get current scopes
     */
    static getScopes(req, res) {
        ApiController.authenticate(req.query.token)
        .then((user) => {
            res.send(user.scopes);
        })
        .catch((e) => {
            res.status(403).send(e);   
        });
    }
    
    /**
     * Get all users
     */
    static getUsers(req, res) {
        UserHelper.getAllUsers()
        .then((users) => {
            res.status(200).send(users);
        })
        .catch((e) => {
            res.status(403).send(e);   
        });
    }

    /**
     * Updates a user
     */
    static postUser(req, res) {
        let username = req.params.username;
        let user = req.body;

        UserHelper.updateUser(username, user)
        .then(() => {
            res.status(200).send(user);
        })
        .catch((e) => {
            res.status(403).send(e);   
        });
    }
    
    /**
     * Creates a user
     */
    static createUser(req, res) {
        let username = req.body.username;
        let password = req.body.password;

        UserHelper.createUser(username, password)
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((e) => {
            res.status(403).send(e);   
        });
    }

    // ----------
    // Templates
    // ----------
    /**
     * Gets an array of all templates
     */
    static getTemplates(req, res) {
        ConnectionHelper.getTemplateProvider()
        .then((connection) => {
            connection.getTemplates()
            .then((templates) => {
                res.status(200).send(templates);
            })
            .catch((e) => {
                debug.log(e, ApiController)
                res.status(404).send([]);
            });            
        })
        .catch((e) => {
            debug.log(e, ApiController)
            res.status(404).send([]);
        });            
    }
    
    /**
     * Gets an array of all section templates
     */
    static getSectionTemplates(req, res) {
        ConnectionHelper.getTemplateProvider()
        .then((connection) => {
            connection.getSectionTemplates()
            .then((templates) => {
                res.status(200).send(templates);
            })
            .catch((e) => {
                debug.log(e, ApiController)
                res.status(404).send([]);
            });            
        })
        .catch((e) => {
            debug.log(e, ApiController)
            res.status(404).send([]);
        });            
    }
    
    // ----------
    // Media methods
    // ---------- 
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
                    res.status(404).send(null);    
                });            
            })
            .catch((e) => {
                debug.log(e, ApiController);
                res.status(404).send(null);    
            });            
        })            
        .catch((e) => {
            res.status(404).send(e);    
            debug.warning(e, ApiController);
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
                            fs.unlinkSync(file.path);

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

module.exports = ApiController;
