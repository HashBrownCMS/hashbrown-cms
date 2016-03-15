'use strict';

// Libs
let multer = require('multer');
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, appRoot + '/storage/temp/');
    },
    filename: function(req, file, cb) {
        let split = file.originalname.split('.');
        let name = split[0];
        let extension = split[1];

        name = name.replace(/\W+/g, '-').toLowerCase() + Date.now();
       
        if(extension) {
            name += '.' + extension;
        }

        cb(null, name);
    }
});
let uploadMedia = multer({
    storage: storage
});

// Models
let Media = require('../models/Media');

// Classes
let Controller = require('./Controller');
let ContentHelper = require('../helpers/ContentHelper');
let SchemaHelper = require('../helpers/SchemaHelper');
let ViewHelper = require('../helpers/ViewHelper');
let PluginHelper = require('../helpers/PluginHelper');
let MediaHelper = require('../helpers/MediaHelper');

/**
 * The main API controller
 */
class ApiController extends Controller {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/api/pages', ApiController.getPages);
        app.get('/api/pages/:id', ApiController.getPage);
        app.post('/api/pages/new', ApiController.createPage);
        app.post('/api/pages/:id', ApiController.postPage);
        app.delete('/api/pages/:id', ApiController.deletePage);

        app.get('/api/schemas', ApiController.getSchemas);
        app.get('/api/schemas/:id', ApiController.getSchema);
        app.post('/api/schemas/:id', ApiController.setSchema);
        
        app.get('/api/sections', ApiController.getSections);

        app.get('/api/media', ApiController.getMedia);
        app.post('/api/media/new', uploadMedia.single('media'), ApiController.createMedia);
        app.post('/api/media/:id', uploadMedia.single('media'), ApiController.setMedia);
        
        app.get('/scripts/editors.js', ApiController.getEditors);
    }
   
    /**
     * Gets a list of Media objects
     */
    static getMedia(req, res) {
        MediaHelper.getAllMedia()
        .then(function(paths) {
            res.send(paths)
        }); 
    }
    
    /**
     * Sets a Media object
     */
    static setMedia(req, res) {
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
    }

    /**
     * Creates a Media object
     */
    static createMedia(req, res) {
        let file = req.file;

        if(file) {
            let media = Media.create(file);

            media.uploadPromise.then(function() {
                res.send(media.data.id);
            });

        } else {
            res.sendStatus(400);
        }
    }

    /**
     * Gets a list of all Section objects
     */
    static getSections(req, res) {
        ContentHelper.getAllSections()
        .then(function(sections) {
            res.send(sections);
        });
    }

    /**
     * Gets a list of all Page objects
     */
    static getPages(req, res) {
        ContentHelper.getAllPages()
        .then(function(pages) {
            res.send(pages);
        });
    }

    /**
     * Gets a Page object by id
     *
     * @return {Object} Page
     */
    static getPage(req, res) {
        let id = req.params.id;
   
        if(id && id != 'undefined') {
            ContentHelper.getPageById(id)
            .then(function(page) {
                res.send(page);
            });
        
        } else {
            throw '[Api] Page id is undefined';
        
        }
    }
    
    /**
     * Creates a new Page object
     *
     * @return {Object} Page
     */
    static createPage(req, res) {
        ContentHelper.createPage(req.body)
        .then(function(page) {
            res.send(page);
        });
    }

    /**
     * Posts a Page object by id
     */
    static postPage(req, res) {
        let id = req.params.id;
        let page = req.body;
        
        ContentHelper.setPageById(id, page)
        .then(function() {
            res.sendStatus(200);
        });
    }
    
    /**
     * Deletes a Page object by id
     */
    static deletePage(req, res) {
        let id = req.params.id;
        
        ContentHelper.removePageById(id)
        .then(function() {
            res.sendStatus(200);
        });
    }

    /**
     * Get a list of all schema objects
     */
    static getSchemas(req, res) {
        SchemaHelper.getAllSchemas()
        .then(function(schemas) {
            res.send(schemas);
        });
    }
    
    /**
     * Get a content schema object by id
     */
    static getSchema(req, res) {
        let id = req.params.id;

        SchemaHelper.getSchema(id)
        .then(function(schema) {
            res.send(schema);
        });
    }
    
    /**
     * Set a content schema object by id
     */
    static setSchema(req, res) {
        let id = req.params.id;
        let schema = req.body;

        SchemaHelper.setSchema(id, schema)
        .then(function() {
            res.sendStatus(200);
        });
    }
    
    /**
     * Get all editors
     */
    static getEditors(req, res) {
        PluginHelper.getAllClientScripts('/editors/*/*.js')
        .then(function(editors) {
            res.send(editors);
        });    
    }
}

module.exports = ApiController;
