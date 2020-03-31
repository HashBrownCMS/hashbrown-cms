'use strict';

/**
 * The controller for testing
 *
 * @memberof HashBrown.Server.Controller
 */
class TestController extends HashBrown.Controller.ControllerBase {
    /**
     * Routes
     */
    static get routes() {
        return {
            '/api/test': {
                handler: this.test,
                user: {
                    isAdmin: true,
                }
            }
        };
    }

    /**
     * @example POST /api/test
     */
    static async test(request, params, body, query, user) {
        let report = '';

        // Create a test project first
        report += 'Creating test project...\n';
        
        let project = await HashBrown.Entity.Project.create(user, 'test ' + new Date().toString());

        // Test connections
        report += '\n[Connections]\n\n';

        report += 'Create connection...\n';
        
        let connection = await HashBrown.Entity.Resource.Connection.create(project.id, 'live', { title: 'Test connection' });

        report += `Get connection ${connection.getName()}...\n`;

        connection = await HashBrown.Entity.Resource.Connection.get(project.id, 'live', connection.id);

        report += `Update connection ${connection.getName()}...\n`;

        connection.title += ' (updated)';
        connection.save(user);
        
        report += 'Get all connections...';

        HashBrown.Entity.Resource.Connection.list(project.id, 'live');

        report += `Remove connection ${connection.getName()}...\n`;

        await connection.remove(user);

        // Test content
        report += '\n[Content]\n\n';
        
        report += 'Create content...\n';
        
        let content = await HashBrown.Entity.Resource.Content.create(user, { schemaId: 'contentBase', title: 'Test content' });
            
        report += `Get content ${content.getName()}...\n`;
        
        content = await HashBrown.Entity.Resource.Content.get(project.id, 'live', content.id);
            
        report += `Update content ${content.getName()}...\n`;
       
        content.title += ' (updated)';
        await content.save(user);
            
        report += 'Get all content...\n';
        
        await HashBrown.Entity.Resource.Content.list(project.id, 'live');
        
        report += `Remove content ${content.getName()}...\n`;
        
        await content.remove(user);

        // Test forms
        report += '\n[Forms]\n\n';
        
        report += 'Create form...\n';

        let form = await HashBrown.Entity.Resource.Form.create(user, { title: 'Test form' });

        report += `Get form ${form.getName()}\n`;
        
        form = await HashBrown.Entity.Resource.Form.get(project.id, 'live', form.id);
            
        report += `Update form ${form.getName()}...\n`;
        
        form.title += ' (updated)';
        await form.save(user);
            
        report += `Add entry to form ${form.getName()}...\n`;
    
        await form.addEntry({});
        
        report += 'Get all forms...\n';
        
        await HashBrown.Entity.Resource.Form.list(project.id, 'live');
            
        report += `Remove form ${form.getName()}...\n`;
        
        await form.remove(user);

        // Test schemas
        report += '\n[Schemas]\n\n';
        
        report += 'Create schema...\n';
        
        let schema = await HashBrown.Entity.Resource.ContentSchema.create(project.id, 'live', { name: 'Test schema' });
        
        report += `Get schema ${schema.getName()}...\n`;
        
        schema = await HashBrown.Entity.Resource.get(project.id, 'live', schema.id, { withParentFields: true });

        report += `Update schema ${schema.getName()}...\n`;
       
        schema.name += ' (updated)';
        await schema.save(user);
        
        report += 'Get all schemas...\n';
        
        await HashBrown.Entity.Resource.ContentSchema.list(project.id, 'live');

        report += `Remove schema ${schema.getName()}...\n`;
        
        await schema.remove(user);
        
        report += '\n[Projects]\n\n';

        report += `Get project ${project.getName()}...\n`;

        project = await HashBrown.Entity.Project.get(project.id);
        
        report += `Add environment to project ${project.getName()}...\n`;
        
        await project.addEnvironment('testenvironment');
        
        report += `Remove environment from project ${project.getName()}...\n`;
        
        await project.removeEnvironment('testEnvironment');
        
        report += `Get all environments from project ${project.getName()}...\n`;
        
        await project.getEnvironments();
        
        report += `Get all users from project ${project.getName()}...\n`;
        
        await project.getUsers();
        
        report += `Get backups for project ${project.getName()}...\n`;
        
        await project.getBackups();

        report += `Create backup for project ${project.getName()}...\n`; 
        
        let backup = await project.createBackup();

        report += `Restore backup ${timestamp} on project ${project.getName()}...\n`;
        
        await project.restoreBackup(backup);
        
        report += `Remove backup ${timestamp} from project ${project.getName()}...\n`;
    
        await project.removeBackup(timestamp);
        
        report += `Remove project ${project.getName()}...\n`;
        
        await project.remove();
        
        report += '\nDone!';

        return HttpResponse(report);
    }
}

module.exports = TestController;
