'use strict';

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
        app.get('/api/pages/new', ApiController.createPage);
        app.get('/api/pages', ApiController.getPages);
        app.get('/api/pages/:id', ApiController.getPage);
        app.post('/api/pages/:id', ApiController.postPage);

        app.get('/api/schemas', ApiController.getSchemas);
        app.get('/api/schemas/:id', ApiController.getSchema);
        app.post('/api/schemas/:id', ApiController.setSchema);
        
        app.get('/api/sections', ApiController.getSections);

        app.get('/api/media', ApiController.getMedia);
        
        app.get('/scripts/editors.js', ApiController.getEditors);
    }
   
    /**
     * Gets a list of media objects
     */
    static getMedia(req, res) {
        MediaHelper.getAllMedia()
        .then(function(paths) {
            res.send(paths)
        }); 
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
        ContentHelper.createPage()
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
