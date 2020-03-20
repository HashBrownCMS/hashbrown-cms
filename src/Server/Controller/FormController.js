'use strict';

const SUBMISSION_TIMEOUT_MS = 1000;

// Private vars
let lastSubmission = Date.now();
let lastIp = '';

/**
 * The controller for Forms
 *
 * @memberof HashBrown.Server.Controller
 */
class FormController extends HashBrown.Controller.ResourceController {
    static get category() { return 'forms'; }
    
    /**
     * Routes
     */
    static get routes() {
        return {
            ...super.routes,
            '/api/${project}/${environment}/forms/${id}/entries': {
                handler: this.entries,
                user: {
                    scope: 'forms'
                }
            },
            '/api/${project}/${environment}/forms/${id}/submit': {
                handler: this.submit,
                methods: [ 'POST' ]
            },
            '/api/${project}/${environment}/forms/${id}/clear': {
                handler: this.clear,
                methods: [ 'POST' ],
                user: {
                    scope: 'forms'
                }
            }
        };
    }
      
    /**
     * @example GET /api/${project}/${environment}/forms/${id}/entries
     */
    static async entries(request, params, body, query, user) {
        let form = await HashBrown.Entity.Resource.Form.get(params.project, params.environment, params.id);

        if(!form) {
            return new HttpResponse('Not found', 404);
        }

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

        let filename = form.getTitle().toLowerCase().replace(/ /g, '-') + '_' + new Date().toISOString() + '.csv';

        return new HttpResponse(csv, 200, {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Cache-Control': 'no-store'
        });
    }
    
    /**
     * @example POST /api/${project}/${environment}/forms/${id}/submit { ... }
     */
    static async submit(request, params, body, query, user) {
        // Prevent spam
        if(
            lastIp != request.socket.remoteAddress || // This IP is not the same as the previous one
            Date.now() - lastSubmission >= SUBMISSION_TIMEOUT_MS // Timeout has been reached
        ) {
            lastSubmission = Date.now();
            lastIp = request.socket.remoteAddress;

            let form = await HashBrown.Entity.Resource.Form.get(params.project, params.environment, params.id);

            if(!form) {
                return new HttpResponse('Not found', 404);
            }
            
            await form.addEntry(params.project, params.environment, body);

            if(form.redirect) {
                let redirectUrl = form.redirect;

                if(form.appendRedirect && request.headers.referer) {
                    redirectUrl = request.headers.referer + redirectUrl;
                }
                
                return new HttpResponse('Redirecting...', 302, { 'Location': redirectUrl });
            }

            return new HttpResponse('OK');
        
        } else {
            return new HttpResponse('Spam prevention triggered. Please try again later.', 400);
        
        }
    }

    /**
     * @example POST /api/${project}/${environment}/forms/${id}/clear
     */
    static async clear(request, params, body, query, user) {
        let form = await HashBrown.Entity.Resource.Form.get(params.project, params.environment, params.id);

        if(!form) {
            return new HttpResponse('Not found', 404);
        }
        
        await form.clear(params.project, params.environment);

        return new HttpResponse('OK');
    }
}

module.exports = FormController;
