'use strict';

/**
 * Schema for content entities
 *
 * @memberof HashBrown.Server.Entity.Resource
 */
class ContentSchema extends require('Common/Entity/Resource/ContentSchema') {
    /**
     * Performs a series of unit test
     *
     * @param {HashBrown.Entity.Context} context
     * @param {Function} report
     */
    static async test(context, report) {
        checkParam(context, 'context', HashBrown.Entity.Context, true);
        checkParam(report, 'report', Function, true);

        report('Create schema');
        
        let schema = await this.create(context, { name: 'Test schema', parentId: 'contentBase' });
        
        report(`Get schema ${schema.getName()}`);
        
        schema = await this.get(context, schema.id, { withParentFields: true });

        report(`Update schema ${schema.getName()}`);
       
        schema.name += ' (updated)';
        await schema.save();
        
        report('Get all schemas');
        
        await this.list(context);

        report(`Remove schema ${schema.getName()}`);
        
        await schema.remove();
    }
   
    /**
     * Converts fields from uischema.org format
     *
     * @param {Object} input
     *
     * @return {Object} Definition
     */
    static convertFromUISchema(input) {
        checkParam(input, 'input', Object, true);

        let i18n = input['@i18n'] && input['@i18n']['en'] ? input['@i18n']['en'] : {};
        let output = {
            id: input['@type'],
            name: i18n['@name'],
            parentId: input['@parent'] || 'contentBase'
        };
        
        for(let key in input['@config'] || {}) {
            output[key] = input['@config'][key];
        }

        let config = {};

        for(let key in input) {
            let definition = this.getFieldFromUISchema(key, input[key], i18n[key]);

            if(!definition) { continue; }

            config[key] = definition;
        }

        output.config = config;
        
        return output;
    }
}

module.exports = ContentSchema;
