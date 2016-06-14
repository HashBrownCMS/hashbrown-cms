'use strict';

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
        app.post('/api/:project/:environment/content/:id', ApiController.postContent);
        app.delete('/api/:project/:environment/content/:id', ApiController.deleteContent);

        // Schemas
        app.get('/api/:project/:environment/schemas', ApiController.getSchemas);
        app.get('/api/:project/:environment/schemas/:id', ApiController.getSchema);
        app.post('/api/:project/:environment/schemas/:id', ApiController.setSchema);
        
        // Media
        app.post('/api/:project/:environment/media/new', MediaHelper.getUploadHandler(), ApiController.createMedia);
        app.get('/api/:project/:environment/media/:id', ApiController.getSingleMedia);
        app.post('/api/:project/:environment/media/:id', MediaHelper.getUploadHandler(), ApiController.setMedia);
        app.delete('/api/:project/:environment/media/:id', ApiController.deleteMedia);
        app.get('/api/:project/:environment/media', ApiController.getMedia);
        
        // Connections
        app.get('/api/:project/:environment/connections', ApiController.getConnections);
        app.get('/api/:project/:environment/connections/:id', ApiController.getConnection);
        app.post('/api/:project/:environment/connections/new', ApiController.createConnection);
        app.post('/api/:project/:environment/connections/:id', ApiController.postConnection);
        app.delete('/api/:project/:environment/connections/:id', ApiController.deleteConnection);
            
        // Settings
        app.get('/api/:project/:environment/settings/:section', ApiController.getSettings);
        app.post('/api/:project/:environment/settings/:section', ApiController.setSettings);

        // Admin
        app.post('/api/admin/login', ApiController.login);
        app.post('/api/admin/new', ApiController.createAdmin);
        app.post('/api/admin/:id', ApiController.postAdmin);

        // Templates
        app.get('/api/:project/:environment/templates', ApiController.getTemplates)
    }
 
    // ----------
    // Media methods
    // ---------- 
    /**
     * Gets a list of Media objects
     */
    static getMedia(req, res) {
        ApiController.authenticate(req, res, () => {
            MediaHelper.getAllMedia()
            .then(function(paths) {
                res.send(paths)
            }); 
        });
    }
    
    /**
     * Gets a single Media object
     */
    static getSingleMedia(req, res) {
        ApiController.authenticate(req, res, () => {
            let id = req.params.id;

            MediaHelper.getMedia(id)
            .then(function(media) {
                res.send(media)
            }); 
        });
    }
    
    /**
     * Deletes a Media object
     */
    static deleteMedia(req, res) {
        ApiController.authenticate(req, res, () => {
            let id = req.params.id;

            MediaHelper.removeMedia(id)
            .then(function() {
                res.sendStatus(200);
            });
        });
    }

    /**
     * Sets a Media object
     */
    static setMedia(req, res) {
        ApiController.authenticate(req, res, () => {
            let file = req.file;
            let id = req.params.id;

            if(file) {
                MediaHelper.setMediaData(id, file)
                .then(function() {
                    res.sendStatus(200);
                });
                
            } else {
                res.sendStatus(400);
            }
        });
    }

    /**
     * Creates a Media object
     */
    static createMedia(req, res) {
        ApiController.authenticate(req, res, () => {
            let file = req.file;

            if(file) {
                let media = Media.create();

                MediaHelper.setMediaData(media.id, file)
                .then(() => {
                    res.send(media.id);
                });

            } else {
                res.sendStatus(400);
            }
        });
    }

    // ----------
    // Content methods
    // ---------- 
    /**
     * Gets a list of all Content objects
     */
    static getAllContents(req, res) {
        ApiController.authenticate(req, res, () => {
            ContentHelper.getAllContents()
            .then(function(nodes) {
                res.send(nodes);
            });
        });
    }

    /**
     * Gets a Content object by id
     *
     * @return {Object} Content
     */
    static getContent(req, res) {
        ApiController.authenticate(req, res, () => {
            let id = req.params.id;
       
            if(id && id != 'undefined') {
                ContentHelper.getContentById(id)
                .then(function(node) {
                    res.send(node);
                });
            
            } else {
                throw '[Api] Content id is undefined';
            
            }
        });
    }
    
    /**
     * Creates a new Content object
     *
     * @return {Content} content
     */
    static createContent(req, res) {
        ApiController.authenticate(req, res, () => {
            ContentHelper.createContent()
            .then(function(node) {
                res.send(node);
            });
        });
    }

    /**
     * Posts a Content object by id
     */
    static postContent(req, res) {
        ApiController.authenticate(req, res, () => {
            let id = req.params.id;
            let node = req.body;
            
            ContentHelper.setContentById(id, node)
            .then(function() {
                res.sendStatus(200);
            });
        });
    }
   
    /**
     * Publishes a Content node
     */
    static publishContent(req, res) {
        ApiController.authenticate(req, res, () => {
            let content = new Content(req.body);

            ConnectionHelper.publishContent(content)
            .then(function() {
                res.sendStatus(200);
            });
        });
    }

    /**
     * Deletes a Content object by id
     */
    static deleteContent(req, res) {
        ApiController.authenticate(req, res, () => {
            let id = req.params.id;
            
            ContentHelper.removeContentById(id)
            .then(function() {
                res.sendStatus(200);
            });
        });
    }
    
    // ----------
    // Connection methods
    // ----------
    /**
     * Gets all connections
     */
    static getConnections(req, res) {
        ApiController.authenticate(req, res, () => {
            ConnectionHelper.getAllConnections()
            .then(function(connections) {
                res.send(connections);
            });
        });
    }

    /**
     * Post connection by id
     */
    static postConnection(req, res) {
        ApiController.authenticate(req, res, () => {
            let id = req.params.id;
            let content = req.body;

            ConnectionHelper.setConnectionById(id, content)
            .then(function(connections) {
                res.sendStatus(200);
            });
        });
    }
    
    /**
     * Gets a connection by id
     */
    static getConnection(req, res) {
        ApiController.authenticate(req, res, () => {
            let id = req.params.id;
       
            if(id && id != 'undefined') {
                ConnectionHelper.getConnectionById(id)
                .then(function(node) {
                    res.send(node);
                });
            
            } else {
                throw '[Api] Connection id is undefined';
            
            }
        });
    }
    
    /**
     * Creates a new connection
     *
     * @return {Object} Content
     */
    static createConnection(req, res) {
        ApiController.authenticate(req, res, () => {
            ConnectionHelper.createConnection()
            .then(function(node) {
                res.send(node);
            });
        });
    }

    /**
     * Deletes a connection by id
     */
    static deleteConnection(req, res) {
        ApiController.authenticate(req, res, () => {
            let id = req.params.id;
            
            ConnectionHelper.removeConnectionById(id)
            .then(function() {
                res.sendStatus(200);
            });
        });
    }
    
    // ----------
    // Schema methods
    // ---------- 
    /**
     * Get a list of all schema objects
     */
    static getSchemas(req, res) {
        ApiController.authenticate(req, res, () => {
            SchemaHelper.getAllSchemas()
            .then(function(schemas) {
                res.send(schemas);
            });
        });
    }
    
    /**
     * Get a content schema object by id
     */
    static getSchema(req, res) {
        ApiController.authenticate(req, res, () => {
            let id = req.params.id;

            SchemaHelper.getSchema(id)
            .then(function(schema) {
                res.send(schema);
            });
        });
    }
    
    /**
     * Set a content schema object by id
     */
    static setSchema(req, res) {
        ApiController.authenticate(req, res, () => {
            let id = req.params.id;
            let schema = req.body;

            SchemaHelper.setSchema(id, schema)
            .then(function() {
                res.sendStatus(200);
            });
        });
    }
    
    // ----------
    // Settings
    // ----------
    /**
     * Get settings object
     */
    static getSettings(req, res) {
        ApiController.authenticate(req, res, () => {
            SettingsHelper.getSettings(req.params.section)
            .then(function(settings) {
                res.send(settings);
            });
        });
    }
    
    /**
     * Set settings object
     */
    static setSettings(req, res) {
        ApiController.authenticate(req, res, () => {
            let settings = req.body;

            SettingsHelper.setSettings(req.params.section, settings)
            .then(function() {
                res.sendStatus(200);
            });
        });
    }

    // ----------
    // Admin
    // ----------
    /**
     * Authenticates an API call
     */
    static authenticate(req, res, onSuccess) {
        let token = req.query.token;

        AdminHelper.findToken(token)
        .then((foundToken) => {
            if(foundToken) {
                onSuccess(req, res);
            } else {
                res.sendStatus(403);
            }
        });
    }

    /** 
     * Logs in an admin
     */
    static login(req, res) {
        let username = req.body.username;
        let password = req.body.password;

        AdminHelper.findAdmin(username)
        .then((admin) => {
            if(admin.validatePassword(password)) {
                let token = admin.generateToken();
                
                AdminHelper.updateAdmin(username, admin.getFields())
                .then(() => {
                    res.send(token);
                });
            } else {
                res.sendStatus(403);
            }
        });
    }

    /**
     * Updates an admin
     */
    static postAdmin(req, res) {
        ApiController.authenticate(req, res, () => {
            let username = req.params.username;
            let admin = req.body;

            AdminHelper.updateAdmin(username, admin)
            .then(() => {
                res.sendStatus(200);
            });
        });
    }
    
    /**
     * Creates an admin
     */
    static createAdmin(req, res) {
        ApiController.authenticate(req, res, () => {
            let username = req.body.username;
            let password = req.body.password;

            AdminHelper.createAdmin(username, password)
            .then(() => {
                res.sendStatus(200);
            });
        });
    }

    // ----------
    // Templates
    // ----------
    static getTemplates(req, res) {
        ApiController.authenticate(req, res, () => {
            res.send([
                'one.html',
                'two.html'
            ]);
        });
    }
}

module.exports = ApiController;
