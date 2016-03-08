'use strict';

let Controller = require('./Controller');
let ContentHelper = require('../helpers/ContentHelper');
let SchemaHelper = require('../helpers/SchemaHelper');
let ViewHelper = require('../helpers/ViewHelper');

/**
 * The main API controller
 */
class ApiController extends Controller {
    /**
     * Initialises this controller
     */
    static init(app) {
        // Register routes
        app.get('/api/pages', ApiController.getPages);
        app.get('/api/pages/:id', ApiController.getPage);
        app.post('/api/pages/:id', ApiController.postPage);

        app.get('/api/objectSchemas', ApiController.getObjectSchemas);
        app.get('/api/objectSchemas/:id', ApiController.getObjectSchema);
        
        app.get('/api/fieldSchemas', ApiController.getFieldSchemas);
        app.get('/api/fieldSchemas/:id', ApiController.getFieldSchema);
        
        app.get('/api/sections', ApiController.getSections);

        app.get('/api/fieldViews', ApiController.getFieldViews);
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
     * Posts a Page object by id
     */
    static postPage(req, res) {
        let id = req.params.id;
        let page = req.body;
        
        ContentHelper.setPageById(id, page)
        .then(function() {
            res.send('Hooray!');
        });
    }

    /**
     * Get a list of all content schema objects
     */
    static getObjectSchemas(req, res) {
        SchemaHelper.getAllSchemas('object')
        .then(function(schemas) {
            res.send(schemas);
        });
    }
    
    /**
     * Get a content schema object by id
     */
    static getObjectSchema(req, res) {
        let id = req.params.id;

        SchemaHelper.getSchema('object', id)
        .then(function(schema) {
            res.send(schema);
        });
    }
    
    /**
     * Get a list of all field schema objects
     */
    static getFieldSchemas(req, res) {
        SchemaHelper.getAllSchemas('field')
        .then(function(schemas) {
            res.send(schemas);
        });
    }
    
    /**
     * Get a field schema object by id
     */
    static getFieldSchema(req, res) {
        let id = req.params.id;

        SchemaHelper.getSchema('field', id)
        .then(function(schema) {
            res.send(schema);
        });
    }

    /**
     * Get all editor views
     */
    static getFieldViews(req, res) {
        ViewHelper.getAllViews('field')
        .then(function(views) {
            res.send(views);
        });    
    }
}

module.exports = ApiController;
