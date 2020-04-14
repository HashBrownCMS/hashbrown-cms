'use strict';

/**
 * The controller for processors
 *
 * @memberof HashBrown.Server.Controller
 */
class ProcessorController extends HashBrown.Controller.ControllerBase {
    /**
     * Routes
     */
    static get routes() {
        return {
            '/api/processors': {
                handler: this.processors,
                user: true
            }
        };
    }        
    
    /**
     * @example GET /api/processors
     */
    static async processors(request, params, body, query, context) {
        let processors = [];

        for(let name in HashBrown.Entity.Processor) {
            let processor = HashBrown.Entity.Processor[name];

            if(processor === HashBrown.Entity.Processor.ProcessorBase) { continue; }

            processors.push(processor.alias);
        }

        return new HashBrown.Http.Response(processors);
    }
}

module.exports = ProcessorController;
