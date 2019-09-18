'use strict';

/**
 * A controller for resource endpoints
 *
 * @memberof HashBrown.Server.Controller
 */
class ResourceController extends HashBrown.Controller.ApiController {
    static get category() {
        throw new Error('The "category" getter method must be overridden');
    }
   
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/api/:project/:environment/' + this.category, this.middleware(), this.getHandler('getAll'));
        app.get('/api/:project/:environment/' + this.category + '/:id', this.middleware(), this.getHandler('get'));

        app.post('/api/:project/:environment/' + this.category + '/new', this.middleware(), this.getHandler('new'));
        app.post('/api/:project/:environment/' + this.category + '/pull/:id', this.middleware(), this.getHandler('pull'));
        app.post('/api/:project/:environment/' + this.category + '/push/:id', this.middleware(), this.getHandler('push'));
        app.post('/api/:project/:environment/' + this.category + '/:id', this.middleware(), this.getHandler('set'));
        app.post('/api/:project/:environment/' + this.category + '/heartbeat/:id', this.middleware(), this.getHandler('heartbeat'));

        app.delete('/api/:project/:environment/' + this.category + '/:id', this.middleware(), this.getHandler('remove'));
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
                    res.status(200).send(response || 'OK');
                
                } else {
                    res.status(404).send('Not found');

                }
            
            } catch(e) {
                res.status(e.code || 404).send(ResourceController.printError(e));

            }
        };
    }

    /**
     * Updates the edited time of a resource
     */
    static async heartbeat(req, res) {
        if(req.body && req.user) {
            await HashBrown.Service.DatabaseService.updateOne(req.project, req.environment + '.' + this.category, { id: req.params.id }, { viewedBy: req.user.id, viewedOn: new Date() });
        }
    }

    /**
     * Gets all resources
     */
    static async getAll(req, res) {
        throw new HttpError(404, 'No method defined for ' + this.name + '::getAll');
    }

    /**
     * Gets a resource item
     */
    static async get(req, res) {
        throw new HttpError(404, 'No method defined for ' + this.name + '::get');
    }
    
    /**
     * Creates a new resource item
     */
    static async new(req, res) {
        throw new HttpError(404, 'No method defined for ' + this.name + '::new');
    }

    /**
     * Pulls a resource item from remote
     */
    static async pull(req, res) {
        throw new HttpError(404, 'No method defined for ' + this.name + '::pull');
    }

    /**
     * Pushes a resource item to remote
     */
    static async push(req, res) {
        throw new HttpError(404, 'No method defined for ' + this.name + '::push');
    }
    
    /**
     * Updates a resource item
     */
    static async set(req, res) {
        throw new HttpError(404, 'No method defined for ' + this.name + '::set');
    }

    /**
     * Removes a resource item
     */
    static async remove(req, res) {
        throw new HttpError(404, 'No method defined for ' + this.name + '::remove');
    }
}

module.exports = ResourceController;
