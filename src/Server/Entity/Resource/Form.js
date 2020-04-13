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
     * @param {HashBrown.Entity.User} user
     * @param {HashBrown.Entity.Project} project
     * @param {Function} report
     */
    static async test(user, project, report) {
        checkParam(user, 'user', HashBrown.Entity.User, true);
        checkParam(project, 'project', HashBrown.Entity.Project, true);
        checkParam(report, 'report', Function, true);
        
        report('Create form');

        let form = await HashBrown.Entity.Resource.Form.create(user, project.id, 'live', { title: 'Test form' });

        report(`Get form ${form.getName()}`);
        
        form = await HashBrown.Entity.Resource.Form.get(project.id, 'live', form.id);
            
        report(`Update form ${form.getName()}`);
        
        form.name += ' (updated)';
        await form.save(user);
            
        report(`Add entry to form ${form.getName()}`);
    
        await form.addEntry({});
        
        report('Get all forms');
        
        await HashBrown.Entity.Resource.Form.list(project.id, 'live');
            
        report(`Remove form ${form.getName()}`);
        
        await form.remove(user);
    }
}

module.exports = Form;
