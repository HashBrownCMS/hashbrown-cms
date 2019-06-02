'use strict';

/**
 * Controller for Content
 *
 * @memberof HashBrown.Server.Controllers
 */
class ContentController extends HashBrown.Controllers.ResourceController {
    static get category() { return 'content'; }
    
    /**
     * Initialises this controller
     */
    static init(app) {
        app.post('/api/:project/:environment/content/publish', this.middleware(), this.getHandler('publish'));
        app.post('/api/:project/:environment/content/unpublish', this.middleware(), this.getHandler('unpublish'));
        app.post('/api/:project/:environment/content/preview', this.middleware(), this.getHandler('preview'));
        app.post('/api/:project/:environment/content/example', this.middleware(), this.getHandler('example'));
        app.post('/api/:project/:environment/content/insert', this.middleware(), this.getHandler('insert'));
        
        super.init(app);
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
    static async example(req, res) {
        await HashBrown.Helpers.ContentHelper.createExampleContent(req.project, req.environment, req.user);
            
        return 'OK';
    }

    /**
     * @example GET /api/:project/:environment/content
     *
     * @apiGroup Content
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Array} Content 
     */
    static async getAll(req, res) {
        return await HashBrown.Helpers.ContentHelper.getAllContent(req.project, req.environment);
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
    static async get(req, res) {
        return await HashBrown.Helpers.ContentHelper.getContentById(req.project, req.environment, req.params.id);
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
    static async preview(req, res) {
        let content = new HashBrown.Models.Content(req.body);

        return await HashBrown.Helpers.ConnectionHelper.previewContent(req.project, req.environment, content, req.user, req.query.language || 'en');
    }

    /**
     * @example POST /api/:project/:environment/content/new
     *
     * @apiGroup Content
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} schemaId
     * @param {String} parentId A parent id (optional)
     * @param {Content} content The Content model to create (optional)
     *
     * @returns {Content} The created Content node
     */
    static async new(req, res) {
        let parentId = req.query.parentId;
        let schemaId = req.query.schemaId;
        let properties = req.body;

        // Sanity check for properties
        if(properties.properties) {
            properties = properties.properties;
        }
        
        return await HashBrown.Helpers.ContentHelper.createContent(req.project, req.environment, schemaId, parentId, req.user, properties);
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
    static async set(req, res) {
        let id = req.params.id;
        let content = new HashBrown.Models.Content(req.body);
        let shouldCreate = req.query.create == 'true' || req.query.create == true;
        
        return await HashBrown.Helpers.ContentHelper.setContentById(req.project, req.environment, id, content, req.user, shouldCreate);
    }
    
    /**
     * @example POST /api/:project/:environment/content/insert
     *
     * @apiGroup Content
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} contentId
     * @param {String} otherId
     * @param {String} parentId
     * @param {String} method Either "before" or "after"
     *
     * @param {Content} content The Content model to update
     *
     * @returns {Content} The created Content node
     */
    static async insert(req, res) {
        return await HashBrown.Helpers.ContentHelper.insertContent(req.project, req.environment, req.user, req.query.contentId, req.query.otherId, req.query.parentId, req.query.method);
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
    static async pull(req, res) {
        let id = req.params.id;

        let resourceItem = await HashBrown.Helpers.SyncHelper.getResourceItem(req.project, req.environment, 'content', id);
        
        if(!resourceItem) { throw new Error('Couldn\'t find remote Content "' + id + '"'); }
        
        await HashBrown.Helpers.ContentHelper.setContentById(req.project, req.environment, id, new HashBrown.Models.Content(resourceItem), req.user, true);

        return resourceItem;
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
    static async push(req, res) {
        let id = req.params.id;

        let localContent = await HashBrown.Helpers.ContentHelper.getContentById(req.project, req.environment, id, true);

        await HashBrown.Helpers.SyncHelper.setResourceItem(req.project, req.environment, 'content', id, localContent);

        return id;
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
    static async publish(req, res) {
        let content = new HashBrown.Models.Content(req.body);

        await HashBrown.Helpers.ConnectionHelper.publishContent(req.project, req.environment, content, req.user);
        
        return content;
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
    static async unpublish(req, res) {
        let content = new HashBrown.Models.Content(req.body);

        await HashBrown.Helpers.ConnectionHelper.unpublishContent(req.project, req.environment, content, req.user);

        return content;
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
    static async remove(req, res) {
        let id = req.params.id;
        let removeChildren = req.query.removeChildren == true || req.query.removeChildren == 'true';

        await HashBrown.Helpers.ContentHelper.removeContentById(req.project, req.environment, id, removeChildren)
        
        return 'Content with id "' + id + '" deleted successfully';
    }
}

module.exports = ContentController;
