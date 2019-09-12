'use strict';

/**
 * The helpers class for system tests
 *
 * @memberof HashBrown.Server.Service
 */
class TestService {
    /**
     * HashBrown.Service.BackupService test
     *
     * @param {String} project
     * @param {Function} onMessage
     *
     * @returns {Promise}
     */
    static async testBackupService(project, onMessage) {
        checkParam(project, 'project', String);
        checkParam(onMessage, 'onMessage', Function);

        onMessage('Get backups for project "' + project + '"');
        
        let backups = await HashBrown.Service.BackupService.getBackupsForProject(project);

        onMessage('Create backup'); 
        
        let timestamp = await HashBrown.Service.BackupService.createBackup(project);

        onMessage('Get path of backup "' + timestamp + '"');
        
        await HashBrown.Service.BackupService.getBackupPath(project, timestamp);
        
        onMessage('Restore backup "' + timestamp + '"');
        
        await HashBrown.Service.BackupService.restoreBackup(project, timestamp);
        
        onMessage('Delete backup "' + timestamp + '"');
    
        await HashBrown.Service.BackupService.deleteBackup(project, timestamp);
    }

    /**
     * HashBrown.Service.ConnectionService test
     *
     * @param {String} project
     * @param {String} environment
     * @param {Function} onMessage
     *
     * @returns {Promise}
     */
    static async testConnectionService(project, environment, onMessage) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(onMessage, 'onMessage', Function);

        onMessage('Create connection')
        
        let testConnection = await HashBrown.Service.ConnectionService.createConnection(project, environment)

        onMessage('Get connection by id "' + testConnection.id + '"');

        testConnection = await HashBrown.Service.ConnectionService.getConnectionById(project, environment, testConnection.id);

        onMessage('Update connection by id "' + testConnection.id + '"');

        await HashBrown.Service.ConnectionService.setConnectionById(project, environment, testConnection.id, testConnection, false);

        onMessage('Remove connection by id "' + testConnection.id + '"');

        await HashBrown.Service.ConnectionService.removeConnectionById(project, environment, testConnection.id);

        onMessage('Get all connections');

        await HashBrown.Service.ConnectionService.getAllConnections(project, environment)
    }

    /**
     * HashBrown.Service.FormService test
     *
     * @param {String} project
     * @param {String} environment
     * @param {Function} onMessage
     *
     * @returns {Promise}
     */
    static async testFormService(project, environment, onMessage) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(onMessage, 'onMessage', Function);

        onMessage('Create form')

        let testForm = await HashBrown.Service.FormService.createForm(project, environment);

        onMessage('Get form by id "' + testForm.id + '"');
        
        await HashBrown.Service.FormService.getForm(project, environment, testForm.id);
            
        onMessage('Update form by id "' + testForm.id + '"');
        
        await HashBrown.Service.FormService.setForm(project, environment, testForm.id, testForm, false);
            
        onMessage('Add entry to form "' + testForm.id + '"');
    
        await HashBrown.Service.FormService.addEntry(project, environment, testForm.id, {});
            
        onMessage('Remove form by id "' + testForm.id + '"');
        
        await HashBrown.Service.FormService.deleteForm(project, environment, testForm.id);
            
        onMessage('Get all forms');
        
        await HashBrown.Service.FormService.getAllForms(project, environment)
    }

    /**
     * HashBrown.Service.ContentService test
     *
     * @param {String} project
     * @param {String} environment
     * @param {User} user
     * @param {Function} onMessage
     *
     * @returns {Promise}
     */
    static async testContentService(project, environment, user, onMessage) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(user, 'user', HashBrown.Entity.Resource.User);
        checkParam(onMessage, 'onMessage', Function);

        onMessage('Create content');
        
        let testContent = await HashBrown.Service.ContentService.createContent(project, environment, 'contentBase', null, user)
            
        onMessage('Get content by id "' + testContent.id + '"');
        
        testContent = await HashBrown.Service.ContentService.getContentById(project, environment, testContent.id);
            
        onMessage('Update content by id "' + testContent.id + '"');
       
        await HashBrown.Service.ContentService.setContentById(project, environment, testContent.id, testContent, user);
            
        onMessage('Remove content by id "' + testContent.id + '"');
        
        await HashBrown.Service.ContentService.removeContentById(project, environment, testContent.id);
            
        onMessage('Get all content');
        
        await HashBrown.Service.ContentService.getAllContent(project, environment)
    }
    
    /**
     * HashBrown.Service.ProjectService test
     *
     * @param {Project} testProject 
     * @param {Function} onMessage
     *
     * @returns {Promise}
     */
    static async testProjectService(project, onMessage) {
        checkParam(project, 'project', String, true);
        checkParam(onMessage, 'onMessage', Function, true);

        onMessage('Get project by id "' + project + '"');

        await HashBrown.Service.ProjectService.getProject(project);
        
        onMessage('Add environment to project "' + project + '"');
        
        await HashBrown.Service.ProjectService.addEnvironment(project, 'testenvironment');
        
        onMessage('Remove environment from project "' + project  + '"');
        
        await HashBrown.Service.ProjectService.deleteEnvironment(project, 'testEnvironment');
        
        onMessage('Get all environments from project "' + project  + '"');
        
        await HashBrown.Service.ProjectService.getAllEnvironments(project);
        
        onMessage('Delete project "' + project  + '"');
        
        await HashBrown.Service.ProjectService.deleteProject(project, false);
    }

    /**
     * HashBrown.Service.SchemaService test
     *
     * @param {String} project
     * @param {String} environment
     * @param {Function} onMessage
     *
     * @returns {Promise}
     */
    static async testSchemaService(project, environment, onMessage) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(onMessage, 'onMessage', Function, true);

        onMessage('Get native schemas');

        await HashBrown.Service.SchemaService.getNativeSchema();

        onMessage('Create schema')
        
        let testSchema = await HashBrown.Service.SchemaService.createSchema(project, environment, 'contentBase');
        
        onMessage('Get schema by id "' + testSchema.id + '"');
        
        testSchema = await HashBrown.Service.SchemaService.getSchemaById(project, environment, testSchema.id, true);

        onMessage('Update schema by id "' + testSchema.id + '"');
        
        testSchema = await HashBrown.Service.SchemaService.setSchemaById(project, environment, testSchema.id, testSchema, false);
        
        onMessage('Remove schema by id "' + testSchema.id + '"');
        
        await HashBrown.Service.SchemaService.removeSchemaById(project, environment, testSchema.id);
        
        onMessage('Get all schemas');
        
        await HashBrown.Service.SchemaService.getAllSchemas(project, environment)
    }
}

module.exports = TestService;
