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
        res.status(404).send('No method defined for ' + this.name + '::getAll');
    }

    /**
     * Gets a resource item
     */
    static async get(req, res) {
        res.status(404).send('No method defined for ' + this.name + '::get');
    }
    
    /**
     * Creates a new resource item
     */
    static async new(req, res) {
        res.status(404).send('No method defined for ' + this.name + '::new');
    }

    /**
     * Pulls a resource item from remote
     */
    static async pull(req, res) {
        res.status(404).send('No method defined for ' + this.name + '::pull');
    }

    /**
     * Pushes a resource item to remote
     */
    static async push(req, res) {
        res.status(404).send('No method defined for ' + this.name + '::push');
    }
    
    /**
     * Updates a resource item
     */
    static async set(req, res) {
        res.status(404).send('No method defined for ' + this.name + '::set');
    }

    /**
     * Removes a resource item
     */
    static async remove(req, res) {
        res.status(404).send('No method defined for ' + this.name + '::remove');
    }
}

module.exports = ResourceController;
