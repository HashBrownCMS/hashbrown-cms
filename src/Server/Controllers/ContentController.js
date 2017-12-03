'use strict';

/**
 * Controller for Content
 *
 * @memberof HashBrown.Server.Controllers
 */
class ContentController extends require('./ApiController') {
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
     * @example POST /api/:project/:environment/content/example
     *
     * @apiGroup Content
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {String} OK
     */
    static createExampleContent(req, res) {
        HashBrown.Helpers.ContentHelper.createExampleContent(req.project, req.environment, req.user)
        .then(() => {
            res.status(200).send('OK');
        })
        .catch((e) => {
            res.status(502).send(ContentController.printError(e));
        });
    }

    /**
     * @example GET /api/:project/:environment/content
     *
     * @apiGroup Content
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Array} Content nodes
     */
    static getAllContents(req, res) {
        HashBrown.Helpers.ContentHelper.getAllContents(req.project, req.environment)
        .then((nodes) => {
            res.status(200).send(nodes);
        })
        .catch((e) => {
            res.status(502).send(ContentController.printError(e));
        });
    }

    /**
     * @example GET /api/:project/:environment/content/:id
     *
     * @apiGroup Content
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @returns {Content} Content
     */
    static getContent(req, res) {
        let id = req.params.id;
   
        if(id && id != 'undefined') {
            HashBrown.Helpers.ContentHelper.getContentById(req.project, req.environment, id)
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
     * @example POST /api/:project/:environment/content/preview
     *
     * @apiGroup Content
     *
     * @param {String} project
     * @param {String} environment
     *
     * @param {Content} content The Content model to preview
     *
     * @returns {String} Preview URL
     */
    static previewContent(req, res) {
        let content = new HashBrown.Models.Content(req.body);

        HashBrown.Helpers.ConnectionHelper.previewContent(req.project, req.environment, content, req.user, req.query.language || 'en')
        .then((previewUrl) => {
            res.status(200).send(previewUrl);
        })
        .catch((e) => {
            res.status(502).send(ContentController.printError(e));   
        });
    }

    /**
     * @example POST /api/:project/:environment/content/new/:schemaId
     *
     * @apiGroup Content
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} schemaId
     *
     * @param {String} sort A sorting index (optional)
     * @param {String} parent A parent id (optional)
     * @param {Content} content The Content model to create (optional)
     *
     * @returns {Content} The created Content node
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
        
        HashBrown.Helpers.ContentHelper.createContent(req.project, req.environment, schemaId, parentId, req.user, properties, sortIndex)
        .then((node) => {
            res.status(200).send(node);
        })
        .catch((e) => {
            res.status(502).send(ContentController.printError(e));
        });
    }

    /**
     * @example POST /api/:project/:environment/content/:id
     *
     * @apiGroup Content
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @param {Content} content The Content model to update
     *
     * @returns {Content} The created Content node
     */
    static postContent(req, res) {
        let id = req.params.id;
        let content = new HashBrown.Models.Content(req.body);
        let shouldCreate = req.query.create == 'true' || req.query.create == true;
        
        HashBrown.Helpers.ContentHelper.setContentById(req.project, req.environment, id, content, req.user, shouldCreate)
        .then(() => {
            res.status(200).send(content);
        })
        .catch((e) => {
            res.status(502).send(ContentController.printError(e));   
        });
    }
   
    /**
     * @example POST /api/:project/:environment/content/pull/:id
     *
     * @apiGroup Content
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @returns {Content} The pulled Content node
     */
    static pullContent(req, res) {
        let id = req.params.id;

        HashBrown.Helpers.SyncHelper.getResourceItem(req.project, req.environment, 'content', id)
        .then((resourceItem) => {
            if(!resourceItem) { return Promise.reject(new Error('Couldn\'t find remote Content "' + id + '"')); }
        
            return HashBrown.Helpers.ContentHelper.setContentById(req.project, req.environment, id, resourceItem, req.user, true)
            .then(() => {
                res.status(200).send(resourceItem);
            });
        })
        .catch((e) => {
            res.status(404).send(ContentController.printError(e));   
        }); 
    }
    
    /**
     * @example POST /api/:project/:environment/content/push/:id
     *
     * @apiGroup Content
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @returns {String} The pushed Content id
     */
    static pushContent(req, res) {
        let id = req.params.id;

        HashBrown.Helpers.ContentHelper.getContentById(req.project, req.environment, id, true)
        .then((localContent) => {
            return HashBrown.Helpers.SyncHelper.setResourceItem(req.project, req.environment, 'content', id, localContent);
        })
        .then(() => {
            res.status(200).send(id);
        })
        .catch((e) => {
            res.status(404).send(ContentController.printError(e));   
        }); 
    }

    /**
     * @example POST /api/:project/:environment/content/publish
     *
     * @apiGroup Content
     *
     * @param {String} project
     * @param {String} environment
     *
     * @param {Content} content the Content model to publish
     *
     * @returns {String} The published Content
     */
    static publishContent(req, res) {
        let content = new HashBrown.Models.Content(req.body);

        HashBrown.Helpers.ConnectionHelper.publishContent(req.project, req.environment, content, req.user)
        .then(() => {
            res.status(200).send(req.body);
        })
        .catch((e) => {
            res.status(502).send(ContentController.printError(e));   
        });
    }
    
    /**
     * @example POST /api/:project/:environment/content/unpublish
     *
     * @apiGroup Content
     *
     * @param {String} project
     * @param {String} environment
     *
     * @param {Content} content the Content model to unpublish
     *
     * @returns {String} The unpublished Content
     */
    static unpublishContent(req, res) {
        let content = new HashBrown.Models.Content(req.body);

        HashBrown.Helpers.ConnectionHelper.unpublishContent(req.project, req.environment, content, req.user)
        .then(() => {
            res.status(200).send(content);
        })
        .catch((e) => {
            res.status(502).send(ContentController.printError(e));
        });
    }

    /**
     * @example DELETE /api/:project/:environment/content/:id
     *
     * @apiGroup Content
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @returns {String} The deleted Content id
     */
    static deleteContent(req, res) {
        let id = req.params.id;
        let removeChildren = req.query.removeChildren == true || req.query.removeChildren == 'true';

        HashBrown.Helpers.ContentHelper.removeContentById(req.project, req.environment, id, removeChildren)
        .then(() => {
            res.status(200).send(id);
        })
        .catch((e) => {
            res.status(502).send(ContentController.printError(e));
        });
    }
}

module.exports = ContentController;
