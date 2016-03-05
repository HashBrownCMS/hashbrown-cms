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
        app.get('/api/content/page/:id', this.getPage);
        app.post('/api/content/page/:id', this.postPage);
    }

    /**
     * Gets a Page object by id
     */
    getPage(req, res) {
        let id = req.params.id;

        return ContentHelper.getPageById(id);
    }

    /**
     * Posts a Page object by id
     */
    postPage(req, res) {
        let id = req.params.id;
        let page = req.body;
        
        return ContentHelper.setPageById(id, page);
    }
}
