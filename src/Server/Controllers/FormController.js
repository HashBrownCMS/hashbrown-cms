'use strict';

const BodyParser = require('body-parser');

const SUBMISSION_TIMEOUT_MS = 1000;

// Private vars
let lastSubmission = Date.now();
let lastIp = '';

/**
 * The controller for Forms
 *
 * @memberof HashBrown.Server.Controllers
 */
class FormController extends HashBrown.Controllers.ResourceController {
    static get category() { return 'forms'; }
    
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/api/:project/:environment/forms/:id/entries', this.middleware(), this.getHandler('entries'));

        app.post('/api/:project/:environment/forms/:id/submit', this.middleware({ authenticate: false, allowCORS: this.checkCORS }), BodyParser.urlencoded({extended: true}), this.getHandler('submit'));
        app.post('/api/:project/:environment/forms/clear/:id', this.middleware(), this.getHandler('clear'));

        super.init(app);

        // Init spam prevention timer
        lastSubmission = Date.now();
    }
      
    /**
     * Check CORS
     *
     * @returns {String} Allowed origin
     */
    static async checkCORS(req, res) {
        let form = await HashBrown.Helpers.FormHelper.getForm(req.params.project, req.params.environment, req.params.id);

        return form.allowedOrigin || '*';
    }

    /**
     * @example GET /api/:project/:environment/forms
     *
     * @apiGroup Forms
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Array} Forms
     */
    static async getAll(req, res) {
        return await HashBrown.Helpers.FormHelper.getAllForms(req.project, req.environment);
    }
    
    /**
     * @example DELETE /api/:project/:environment/forms/:id
     *
     * @apiGroup Forms
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     */
    static async remove(req, res) {
        await HashBrown.Helpers.FormHelper.deleteForm(req.project, req.environment, req.params.id)
    }
    
    /**
     * @example POST /api/:project/:environment/forms/pull/:id
     *
     * @apiGroup Forms
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @returns {Form} The pulled Form
     */
    static async pull(req, res) {
        let id = req.params.id;

        let resourceItem = await HashBrown.Helpers.SyncHelper.getResourceItem(req.project, req.environment, 'forms', id);
    
        if(!resourceItem) { return Promise.reject(new Error('Couldn\'t find remote Form "' + id + '"')); }
   
        return await HashBrown.Helpers.FormHelper.setForm(req.project, req.environment, id, new HashBrown.Models.Form(resourceItem));
    }
    
    /**
     * @example POST /api/:project/:environment/forms/push/:id
     *
     * @apiGroup Forms
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @returns {Form} The pushed Form id
     */
    static async push(req, res) {
        let id = req.params.id;

        let localForm = await HashBrown.Helpers.FormHelper.getForm(req.project, req.environment, id);

        return await HashBrown.Helpers.SyncHelper.setResourceItem(req.project, req.environment, 'forms', id, localForm);
    }

    /**
     * @example GET /api/:project/:environment/forms/:id
     *
     * @apiGroup Forms
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @returns {Form} Form
     */
    static async get(req, res) {
        return await HashBrown.Helpers.FormHelper.getForm(req.project, req.environment, req.params.id);
    }
    
    /**
     * @example GET /api/:project/:environment/forms/:id/entries
     *
     * @apiGroup Forms
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @returns {String} CSV string
     */
    static async entries(req, res) {
        let form = await HashBrown.Helpers.FormHelper.getForm(req.project, req.environment, req.params.id);

        let csv = '';

        for(let inputKey in form.inputs) {
            csv += '"' + inputKey + '",';
        }

        csv += '"time"';
        
        csv += '\r\n';

        for(let entry of form.entries) {
            for(let inputKey in form.inputs) {
                csv += '"' + (entry[inputKey] || ' ') + '",';
            }
            
            csv += entry.time || 'n/a';
            
            csv += '\r\n';
        }

        res.attachment(form.title.toLowerCase().replace(/ /g, '-') + '_' + new Date().toISOString() + '.csv');

        return csv;
    }
    
    /**
     * @example POST /api/:project/:environment/forms/:id
     *
     * @apiGroup Forms
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @param {Form} The Form model to update
     *
     * @returns {Form} Form
     */
    static async set(req, res) {
        let shouldCreate = req.query.create == 'true' || req.query.create == true;
        
        await HashBrown.Helpers.FormHelper.setForm(req.project, req.environment, req.params.id, new HashBrown.Models.Form(req.body), shouldCreate);
    }

    /**
     * @example POST /api/:project/:environment/forms/new
     *
     * @apiGroup Forms
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {String} The created Form id
     */
    static async new(req, res) {
        return await HashBrown.Helpers.FormHelper.createForm(req.project, req.environment);
    }

    /**
     * @example POST /api/:project/:environment/forms/:id/submit
     *
     * @apiGroup Forms
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @param {Object} entries The submitted entries
     */
    static async submit(req, res) {
        // Prevent spam
        if(
            lastIp != req.connection.remoteAddress || // This IP is not the same as the previous one
            Date.now() - lastSubmission >= SUBMISSION_TIMEOUT_MS // Timeout has been reached
        ) {
            lastSubmission = Date.now();
            lastIp = req.connection.remoteAddress;

            let form = await HashBrown.Helpers.FormHelper.addEntry(req.project, req.environment, req.params.id, req.body);

            if(form.redirect) {
                let redirectUrl = form.redirect;

                if(form.appendRedirect && req.headers.referer) {
                    redirectUrl = req.headers.referer + redirectUrl;
                }
                
                res.status(302).redirect(redirectUrl);
            }

            return false;
        
        } else {
            throw new Error('Spam prevention triggered. Please try again later.');
        
        }
    }

    /**
     * @example POST /api/:project/:environment/forms/clear/:id
     *
     * @apiGroup Forms
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     */
    static async clear(req, res) {
        await HashBrown.Helpers.FormHelper.clearAllEntries(req.project, req.environment, req.params.id);
    }
}

module.exports = FormController;
