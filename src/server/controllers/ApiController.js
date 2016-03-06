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
        app.get('/api/content/pages', this.getPages);
        app.get('/api/content/page/:id', this.getPage);
        app.post('/api/content/page/:id', this.postPage);

        app.get('/api/schemas', this.getSchemas);
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
    
        ContentHelper.getPageById(id)
        .then(function(page) {
            res.send(page);
        });
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
     * Get a list of all Schema objects
     */
    getSchemas(req, res) {
        ContentHelper.getAllSchemas()
        .then(function(schemas) {
            res.send(schemas);
        });
    }
}

module.exports = ApiController;
