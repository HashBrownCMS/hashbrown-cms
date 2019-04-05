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
    static testBackupHelper(project, onMessage) {
        checkParam(project, 'project', String);
        checkParam(onMessage, 'onMessage', Function);

        let timestamp;

        onMessage('Get backups for project "' + project + '"');
        return HashBrown.Helpers.BackupHelper.getBackupsForProject(project)
        .then((backups) => {
            onMessage('Create backup'); 
            return HashBrown.Helpers.BackupHelper.createBackup(project);
        })
        .then((newTimestamp) => {
            timestamp = newTimestamp;

            onMessage('Get path of backup "' + timestamp + '"');
            return HashBrown.Helpers.BackupHelper.getBackupPath(project, timestamp);
        }).then((path) => {
            onMessage('Restore backup "' + timestamp + '"');
            return HashBrown.Helpers.BackupHelper.restoreBackup(project, timestamp);
        }).then((path) => {
            onMessage('Delete backup "' + timestamp + '"');
            return HashBrown.Helpers.BackupHelper.deleteBackup(project, timestamp);
        });
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
    static testConnectionHelper(project, environment, onMessage) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(onMessage, 'onMessage', Function);

        onMessage('Create connection')
        return HashBrown.Helpers.ConnectionHelper.createConnection(project, environment)
        .then((testConnection) => {
            onMessage('Get connection by id "' + testConnection.id + '"');
            return HashBrown.Helpers.ConnectionHelper.getConnectionById(project, environment, testConnection.id);
        })
        .then((testConnection) => {
            onMessage('Update connection by id "' + testConnection.id + '"');
            return HashBrown.Helpers.ConnectionHelper.setConnectionById(project, environment, testConnection.id, testConnection, false);
        })
        .then((testConnection) => {
            onMessage('Remove connection by id "' + testConnection.id + '"');
            return HashBrown.Helpers.ConnectionHelper.removeConnectionById(project, environment, testConnection.id);
        })
        .then(() => {   
            onMessage('Get all connections');
            return HashBrown.Helpers.ConnectionHelper.getAllConnections(project, environment)
        });
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
    static testFormHelper(project, environment, onMessage) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(onMessage, 'onMessage', Function);

        onMessage('Create form')
        return HashBrown.Helpers.FormHelper.createForm(project, environment)
        .then((testForm) => {
            onMessage('Get form by id "' + testForm.id + '"');
            return HashBrown.Helpers.FormHelper.getForm(project, environment, testForm.id);
        })
        .then((testForm) => {
            onMessage('Update form by id "' + testForm.id + '"');
            return HashBrown.Helpers.FormHelper.setForm(project, environment, testForm.id, testForm, false);
        })
        .then((testForm) => {
            onMessage('Add entry to form "' + testForm.id + '"');
            return HashBrown.Helpers.FormHelper.addEntry(project, environment, testForm.id, {});
        })
        .then((testForm) => {
            onMessage('Remove form by id "' + testForm.id + '"');
            return HashBrown.Helpers.FormHelper.deleteForm(project, environment, testForm.id);
        })
        .then(() => {   
            onMessage('Get all forms');
            return HashBrown.Helpers.FormHelper.getAllForms(project, environment)
        });
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
    static testContentHelper(project, environment, user, onMessage) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(user, 'user', HashBrown.Models.User);
        checkParam(onMessage, 'onMessage', Function);

        onMessage('Create content');
        return HashBrown.Helpers.ContentHelper.createContent(
            project,
            environment,
            'contentBase',
            null,
            user
        ).then((testContent) => {
            onMessage('Get content by id "' + testContent.id + '"');
            return HashBrown.Helpers.ContentHelper.getContentById(project, environment, testContent.id);
        })
        .then((testContent) => {
            onMessage('Update content by id "' + testContent.id + '"');
            return HashBrown.Helpers.ContentHelper.setContentById(project, environment, testContent.id, testContent, user);
        })
        .then((testContent) => {
            onMessage('Remove content by id "' + testContent.id + '"');
            return HashBrown.Helpers.ContentHelper.removeContentById(project, environment, testContent.id);
        })
        .then(() => {   
            onMessage('Get all contents');
            return HashBrown.Helpers.ContentHelper.getAllContents(project, environment)
        });
    }
    
    /**
     * HashBrown.Helpers.ProjectHelper test
     *
     * @param {Project} testProject 
     * @param {Function} onMessage
     *
     * @returns {Promise}
     */
    static testProjectHelper(testProject, onMessage) {
        checkParam(testProject, 'testProject', HashBrown.Models.Project);
        checkParam(onMessage, 'onMessage', Function);

        onMessage('Get project by id "' + testProject.id + '"');
        return HashBrown.Helpers.ProjectHelper.getProject(testProject.id)
        .then(() => {
            onMessage('Add environment to project "' + testProject.id + '"');
            return HashBrown.Helpers.ProjectHelper.addEnvironment(testProject.id, 'testenvironment');
        })
        .then((testEnvironment) => {
            onMessage('Remove environment from project "' + testProject.id  + '"');
            return HashBrown.Helpers.ProjectHelper.deleteEnvironment(testProject.id, testEnvironment);
        })
        .then(() => {
            onMessage('Get all environments from project "' + testProject.id  + '"');
            return HashBrown.Helpers.ProjectHelper.getAllEnvironments(testProject.id);
        })
        .then(() => {
            onMessage('Delete project "' + testProject.id  + '"');
            return HashBrown.Helpers.ProjectHelper.deleteProject(testProject.id, false);
        });
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
    static testSchemaHelper(project, environment, onMessage) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(onMessage, 'onMessage', Function);

        onMessage('Get native schemas');
        return HashBrown.Helpers.SchemaHelper.getNativeSchemas()
        .then((nativeSchemas) => {
            onMessage('Create schema')
            return HashBrown.Helpers.SchemaHelper.createSchema(
                project,
                environment,
                'contentBase'
            );
        })
        .then((testSchema) => {
            onMessage('Get schema by id "' + testSchema.id + '"');
            return HashBrown.Helpers.SchemaHelper.getSchemaWithParentFields(project, environment, testSchema.id);
        })
        .then((testSchema) => {
            onMessage('Update schema by id "' + testSchema.id + '"');
            return HashBrown.Helpers.SchemaHelper.setSchemaById(project, environment, testSchema.id, testSchema, false);
        })
        .then((testSchema) => {
            onMessage('Remove schema by id "' + testSchema.id + '"');
            return HashBrown.Helpers.SchemaHelper.removeSchemaById(project, environment, testSchema.id);
        })
        .then(() => {   
            onMessage('Get all schemas');
            return HashBrown.Helpers.SchemaHelper.getAllSchemas(project, environment)
        });
    }
}

module.exports = TestHelper;
