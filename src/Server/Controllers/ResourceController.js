'use strict';

/**
 * A controller for resource endpoints
 *
 * @memberof HashBrown.Server.Controllers
 */
class ResourceController extends HashBrown.Controllers.ApiController {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/api/:project/:environment/' + this.category, this.middleware(), this.getHandler('getAll'));
        app.get('/api/:project/:environment/' + this.category + '/:id', this.middleware(), this.getHandler('get'));

        app.post('/api/:project/:environment/' + this.category + '/new', this.middleware(), this.getHandler('new'));
        app.post('/api/:project/:environment/' + this.cetegory + '/pull/:id', this.middleware(), this.getHandler('pull'));
        app.post('/api/:project/:environment/' + this.category + '/push/:id', this.middleware(), this.getHandler('push'));
        app.post('/api/:project/:environment/' + this.category + '/:id', this.middleware(), this.getHandler('set'));

        app.delete('/api/:project/:environment/' + this.category + '/:id', this.middleware(), this.getHandler('remove'));
    }

    /**
     * Gets the category of this controller
     */
    static get category() {
        throw new Error('The "category" getter method must be overridden');
    }
   
    /**
     * Gets an endpoint handler
     *
     * @param {String} name
     *
     * @return {Function} Handler reference
     */
    static getHandler(name) {
        if(typeof this[name] !== 'function') { throw new Error('Handler method "' + name + '" could not be found'); }

        return async (req, res) => {
            try {
                let response = await this[name](req, res);

                if(response !== false) {
                    res.status(200).send(response);
                }
            
            } catch(e) {
                res.status(502).send(ResourceController.printError(e));

            }
        };
    }

    /**
     * Gets all resources
     */
    static async getAll(req, res) {
        throw new Error('The "getAll" method must be overridden');
    }

    /**
     * Gets a resource item
     */
    static async get(req, res) {
        throw new Error('The "get" method must be overridden');
    }
    
    /**
     * Creates a new resource item
     */
    static async new(req, res) {
        throw new Error('The "new" method must be overridden');
    }

    /**
     * Pulls a resource item from remote
     */
    static async pull(req, res) {
        throw new Error('The "pull" method must be overridden');
    }

    /**
     * Pushes a resource item to remote
     */
    static async push(req, res) {
        throw new Error('The "push" method must be overridden');
    }
    
    /**
     * Updates a resource item
     */
    static async set(req, res) {
        throw new Error('The "set" method must be overridden');
    }

    /**
     * Removes a resource item
     */
    static async remove(req, res) {
        throw new Error('The "remove" method must be overridden');
    }
}

module.exports = ResourceController;
