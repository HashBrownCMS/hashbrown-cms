'use strict';

let Controller = require('./Controller');
let ContentHelper = require('../helpers/ContentHelper');

/**
 * The main API controller
 */
class ApiController extends Controller {
    constructor(app) {
        super(app);
    
        // Register routes
        app.get('/api/pages', this.getPages);
        app.get('/api/pages/:id', this.getPage);
        app.post('/api/pages/:id', this.postPage);

        app.get('/api/objectSchemas', this.getObjectSchemas);
        app.get('/api/objectSchemas/:id', this.getObjectSchema);
        
        app.get('/api/fieldSchemas', this.getFieldSchemas);
        app.get('/api/fieldSchemas/:id', this.getFieldSchema);
        
        app.get('/api/sections', this.getSections);
    }
    
    /**
     * Gets a list of all Section objects
     */
    getSections(req, res) {
        ContentHelper.getAllSections()
        .then(function(sections) {
            res.send(sections);
        });
    }

    /**
     * Gets a list of all Page objects
     */
    getPages(req, res) {
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
    getPage(req, res) {
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
    postPage(req, res) {
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
    getObjectSchemas(req, res) {
        ContentHelper.getAllSchemas('object')
        .then(function(schemas) {
            res.send(schemas);
        });
    }
    
    /**
     * Get a content schema object by id
     */
    getObjectSchema(req, res) {
        let id = req.params.id;

        ContentHelper.getSchema('object', id)
        .then(function(schema) {
            res.send(schema);
        });
    }
    
    /**
     * Get a list of all field schema objects
     */
    getFieldSchemas(req, res) {
        ContentHelper.getAllSchemas('field')
        .then(function(schemas) {
            res.send(schemas);
        });
    }
    
    /**
     * Get a field schema object by id
     */
    getFieldSchema(req, res) {
        let id = req.params.id;

        ContentHelper.getSchema('field', id)
        .then(function(schema) {
            res.send(schema);
        });
    }
}

module.exports = ApiController;
