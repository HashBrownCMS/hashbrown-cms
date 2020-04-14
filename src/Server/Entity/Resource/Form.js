'use strict';

/**
 * The form entity type
 *
 * @memberof HashBrown.Server.Entity.Resource
 */
class Form extends require('Common/Entity/Resource/Form') {
    /**
     * Performs a series of unit test
     *
     * @param {HashBrown.Entity.Context} context
     * @param {Function} report
     */
    static async test(context, report) {
        checkParam(context, 'context', HashBrown.Entity.Context, true);
        checkParam(report, 'report', Function, true);
        
        report('Create form');

        let form = await this.create(context, { title: 'Test form' });

        report(`Get form ${form.getName()}`);
        
        form = await this.get(context, form.id);
            
        report(`Update form ${form.getName()}`);
        
        form.name += ' (updated)';
        await form.save();
            
        report(`Add entry to form ${form.getName()}`);
    
        await form.addEntry({});
        
        report('Get all forms');
        
        await this.list(context);
            
        report(`Remove form ${form.getName()}`);
        
        await form.remove();
    }
}

module.exports = Form;
