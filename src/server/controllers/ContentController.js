'use strict';

// Classes
let ApiController = require('./ApiController');
let Content = require('../models/Content');

/**
 * Controller for Content
 */
class ContentController extends ApiController {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/api/:project/:environment/content', this.middleware(), this.getAllContents);
        app.get('/api/:project/:environment/content/:id', this.middleware(), this.getContent);

        app.post('/api/:project/:environment/content/new/:schemaId', this.middleware(), this.createContent);
        app.post('/api/:project/:environment/content/pull/:id', this.middleware(), this.pullContent);
        app.post('/api/:project/:environment/content/push/:id', this.middleware(), this.pushContent);
        app.post('/api/:project/:environment/content/publish', this.middleware(), this.publishContent);
        app.post('/api/:project/:environment/content/unpublish', this.middleware(), this.unpublishContent);
        app.post('/api/:project/:environment/content/preview', this.middleware(), this.previewContent);
        app.post('/api/:project/:environment/content/example', this.middleware(), this.createExampleContent);
        app.post('/api/:project/:environment/content/:id', this.middleware(), this.postContent);

        app.delete('/api/:project/:environment/content/:id', this.middleware(), this.deleteContent);
    }
   
    /**
     * Creates the example content
     */
    static createExampleContent(req, res) {
        ContentHelper.createExampleContent(req.project, req.environment, req.user)
        .then(() => {
            res.status(200).send('OK');
        })
        .catch((e) => {
            res.status(502).send(ContentController.printError(e));
        });
    }

    /**
     * Gets a list of all Content objects
     */
    static getAllContents(req, res) {
        ContentHelper.getAllContents(req.project, req.environment)
        .then(function(nodes) {
            res.status(200).send(nodes);
        })
        .catch((e) => {
            res.status(502).send(ContentController.printError(e));
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
            ContentHelper.getContentById(req.project, req.environment, id)
            .then((node) => {
                res.status(200).send(node);
            })
            .catch((e) => {
                res.status(502).send(ContentController.printError(e));
            });
        
        } else {
            res.status(400).send(ContentController.printError(new Error('Content id is undefined')));

        }
    }
    
    /**
     * Creates a Content preview by id
     */
    static previewContent(req, res) {
        let content = new Content(req.body);

        ConnectionHelper.previewContent(req.project, req.environment, content, req.user, req.query.language || 'en')
        .then((previewUrl) => {
            res.status(200).send(previewUrl);
        })
        .catch((e) => {
            res.status(502).send(ContentController.printError(e));   
        });
    }

    /**
     * Creates a new Content object
     *
     * @return {Content} content
     */
    static createContent(req, res) {
        let parentId = req.query.parent;
        let sortIndex = req.query.sort;
        let schemaId = req.params.schemaId;
        let properties = req.body;

        // Sanity check for properties
        if(properties.properties) {
            properties = properties.properties;
        }
        
        ContentHelper.createContent(req.project, req.environment, schemaId, parentId, req.user, properties, sortIndex)
        .then((node) => {
            res.status(200).send(node);
        })
        .catch((e) => {
            res.status(502).send(ContentController.printError(e));
        });
    }

    /**
     * Posts a Content object by id
     */
    static postContent(req, res) {
        let id = req.params.id;
        let node = req.body;
        let shouldCreate = req.query.create == 'true' || req.query.create == true;
        
        ContentHelper.setContentById(req.project, req.environment, id, node, req.user, shouldCreate)
        .then(() => {
            res.status(200).send(node);
        })
        .catch((e) => {
            res.status(502).send(ContentController.printError(e));   
        });
    }
   
    /**
     * Pulls Content by id
     */
    static pullContent(req, res) {
        let id = req.params.id;

        SyncHelper.getResourceItem(req.project, req.environment, 'content', id)
        .then((resourceItem) => {
            if(!resourceItem) { return Promise.reject(new Error('Couldn\'t find remote Content "' + id + '"')); }
        
            return ContentHelper.setContentById(req.project, req.environment, id, resourceItem, req.user, true)
            .then(() => {
                res.status(200).send(resourceItem);
            });
        })
        .catch((e) => {
            res.status(404).send(ContentController.printError(e));   
        }); 
    }
    
    /**
     * Pushes Content by id
     */
    static pushContent(req, res) {
        let id = req.params.id;

        ContentHelper.getContentById(req.project, req.environment, id, true)
        .then((localContent) => {
            return SyncHelper.setResourceItem(req.project, req.environment, 'content', id, localContent);
        })
        .then(() => {
            res.status(200).send(id);
        })
        .catch((e) => {
            res.status(404).send(ContentController.printError(e));   
        }); 
    }

    /**
     * Publishes a Content node
     */
    static publishContent(req, res) {
        let content = new Content(req.body);

        ConnectionHelper.publishContent(req.project, req.environment, content, req.user)
        .then(() => {
            res.status(200).send(req.body);
        })
        .catch((e) => {
            res.status(502).send(ContentController.printError(e));   
        });
    }
    
    /**
     * Unpublishes a Content node
     */
    static unpublishContent(req, res) {
        let content = new Content(req.body);

        ConnectionHelper.unpublishContent(req.project, req.environment, content, req.user)
        .then(() => {
            res.status(200).send(content);
        })
        .catch((e) => {
            res.status(502).send(ContentController.printError(e));
        });
    }

    /**
     * Deletes a Content object by id
     */
    static deleteContent(req, res) {
        let id = req.params.id;
        let removeChildren = req.query.removeChildren == true || req.query.removeChildren == 'true';

        ContentHelper.removeContentById(req.project, req.environment, id, removeChildren)
        .then(() => {
            res.status(200).send(id);
        })
        .catch((e) => {
            res.status(502).send(ContentController.printError(e));
        });
    }
}

module.exports = ContentController;
