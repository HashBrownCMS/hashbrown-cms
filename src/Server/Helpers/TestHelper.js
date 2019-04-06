'use strict';

/**
 * The helpers class for system tests
 *
 * @memberof HashBrown.Server.Helpers
 */
class TestHelper {
    /**
     * HashBrown.Helpers.BackupHelper test
     *
     * @param {String} project
     * @param {Function} onMessage
     *
     * @returns {Promise}
     */
    static async testBackupHelper(project, onMessage) {
        checkParam(project, 'project', String);
        checkParam(onMessage, 'onMessage', Function);

        onMessage('Get backups for project "' + project + '"');
        
        let backups = await HashBrown.Helpers.BackupHelper.getBackupsForProject(project);

        onMessage('Create backup'); 
        
        let timestamp = await HashBrown.Helpers.BackupHelper.createBackup(project);

        onMessage('Get path of backup "' + timestamp + '"');
        
        await HashBrown.Helpers.BackupHelper.getBackupPath(project, timestamp);
        
        onMessage('Restore backup "' + timestamp + '"');
        
        await HashBrown.Helpers.BackupHelper.restoreBackup(project, timestamp);
        
        onMessage('Delete backup "' + timestamp + '"');
    
        await HashBrown.Helpers.BackupHelper.deleteBackup(project, timestamp);
    }

    /**
     * HashBrown.Helpers.ConnectionHelper test
     *
     * @param {String} project
     * @param {String} environment
     * @param {Function} onMessage
     *
     * @returns {Promise}
     */
    static async testConnectionHelper(project, environment, onMessage) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(onMessage, 'onMessage', Function);

        onMessage('Create connection')
        
        let testConnection = await HashBrown.Helpers.ConnectionHelper.createConnection(project, environment)

        onMessage('Get connection by id "' + testConnection.id + '"');

        testConnection = await HashBrown.Helpers.ConnectionHelper.getConnectionById(project, environment, testConnection.id);

        onMessage('Update connection by id "' + testConnection.id + '"');

        await HashBrown.Helpers.ConnectionHelper.setConnectionById(project, environment, testConnection.id, testConnection, false);

        onMessage('Remove connection by id "' + testConnection.id + '"');

        await HashBrown.Helpers.ConnectionHelper.removeConnectionById(project, environment, testConnection.id);

        onMessage('Get all connections');

        await HashBrown.Helpers.ConnectionHelper.getAllConnections(project, environment)
    }

    /**
     * HashBrown.Helpers.FormHelper test
     *
     * @param {String} project
     * @param {String} environment
     * @param {Function} onMessage
     *
     * @returns {Promise}
     */
    static async testFormHelper(project, environment, onMessage) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(onMessage, 'onMessage', Function);

        onMessage('Create form')

        let testForm = await HashBrown.Helpers.FormHelper.createForm(project, environment);

        onMessage('Get form by id "' + testForm.id + '"');
        
        await HashBrown.Helpers.FormHelper.getForm(project, environment, testForm.id);
            
        onMessage('Update form by id "' + testForm.id + '"');
        
        await HashBrown.Helpers.FormHelper.setForm(project, environment, testForm.id, testForm, false);
            
        onMessage('Add entry to form "' + testForm.id + '"');
    
        await HashBrown.Helpers.FormHelper.addEntry(project, environment, testForm.id, {});
            
        onMessage('Remove form by id "' + testForm.id + '"');
        
        await HashBrown.Helpers.FormHelper.deleteForm(project, environment, testForm.id);
            
        onMessage('Get all forms');
        
        await HashBrown.Helpers.FormHelper.getAllForms(project, environment)
    }

    /**
     * HashBrown.Helpers.ContentHelper test
     *
     * @param {String} project
     * @param {String} environment
     * @param {User} user
     * @param {Function} onMessage
     *
     * @returns {Promise}
     */
    static async testContentHelper(project, environment, user, onMessage) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(user, 'user', HashBrown.Models.User);
        checkParam(onMessage, 'onMessage', Function);

        onMessage('Create content');
        
        let testContent = await HashBrown.Helpers.ContentHelper.createContent(project, environment, 'contentBase', null, user)
            
        onMessage('Get content by id "' + testContent.id + '"');
        
        testContent = await HashBrown.Helpers.ContentHelper.getContentById(project, environment, testContent.id);
            
        onMessage('Update content by id "' + testContent.id + '"');
       
        await HashBrown.Helpers.ContentHelper.setContentById(project, environment, testContent.id, testContent, user);
            
        onMessage('Remove content by id "' + testContent.id + '"');
        
        await HashBrown.Helpers.ContentHelper.removeContentById(project, environment, testContent.id);
            
        onMessage('Get all contents');
        
        await HashBrown.Helpers.ContentHelper.getAllContents(project, environment)
    }
    
    /**
     * HashBrown.Helpers.ProjectHelper test
     *
     * @param {Project} testProject 
     * @param {Function} onMessage
     *
     * @returns {Promise}
     */
    static async testProjectHelper(project, onMessage) {
        checkParam(project, 'project', String, true);
        checkParam(onMessage, 'onMessage', Function, true);

        onMessage('Get project by id "' + project + '"');

        await HashBrown.Helpers.ProjectHelper.getProject(project);
        
        onMessage('Add environment to project "' + project + '"');
        
        await HashBrown.Helpers.ProjectHelper.addEnvironment(project, 'testenvironment');
        
        onMessage('Remove environment from project "' + project  + '"');
        
        await HashBrown.Helpers.ProjectHelper.deleteEnvironment(project, 'testEnvironment');
        
        onMessage('Get all environments from project "' + project  + '"');
        
        await HashBrown.Helpers.ProjectHelper.getAllEnvironments(project);
        
        onMessage('Delete project "' + project  + '"');
        
        await HashBrown.Helpers.ProjectHelper.deleteProject(project, false);
    }

    /**
     * HashBrown.Helpers.SchemaHelper test
     *
     * @param {String} project
     * @param {String} environment
     * @param {Function} onMessage
     *
     * @returns {Promise}
     */
    static async testSchemaHelper(project, environment, onMessage) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(onMessage, 'onMessage', Function, true);

        onMessage('Get native schemas');

        await HashBrown.Helpers.SchemaHelper.getNativeSchemas();

        onMessage('Create schema')
        
        let testSchema = await HashBrown.Helpers.SchemaHelper.createSchema(project, environment, 'contentBase');
        
        onMessage('Get schema by id "' + testSchema.id + '"');
        
        testSchema = await HashBrown.Helpers.SchemaHelper.getSchemaById(project, environment, testSchema.id, true);

        onMessage('Update schema by id "' + testSchema.id + '"');
        
        testSchema = await HashBrown.Helpers.SchemaHelper.setSchemaById(project, environment, testSchema.id, testSchema, false);
        
        onMessage('Remove schema by id "' + testSchema.id + '"');
        
        await HashBrown.Helpers.SchemaHelper.removeSchemaById(project, environment, testSchema.id);
        
        onMessage('Get all schemas');
        
        await HashBrown.Helpers.SchemaHelper.getAllSchemas(project, environment)
    }
}

module.exports = TestHelper;
