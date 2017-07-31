'use strict';

const BackupHelper = require('Server/Helpers/BackupHelper');
const ConnectionHelper = require('Server/Helpers/ConnectionHelper');
const ContentHelper = require('Server/Helpers/ContentHelper');
const FormHelper = require('Server/Helpers/FormHelper');
const ProjectHelper = require('Server/Helpers/ProjectHelper');
const SchemaHelper = require('Server/Helpers/SchemaHelper');
const UpdateHelper = require('Server/Helpers/UpdateHelper');

/**
 * The helpers class for system tests
 *
 * @memberof HashBrown.Server.Helpers
 */
class TestHelper {
    /**
     * BackupHelper test
     *
     * @param {String} project
     *
     * @returns {Promise}
     */
    static testBackupHelper(
        project = requiredParam('project'),
        onMessage = requiredParam('onMessage')
    ) {
        let timestamp;

        onMessage('Get backups for project "' + project + '"');
        return BackupHelper.getBackupsForProject(project)
        .then((backups) => {
            onMessage('Create backup'); 
            return BackupHelper.createBackup(project);
        })
        .then((newTimestamp) => {
            timestamp = newTimestamp;

            onMessage('Get path of backup "' + timestamp + '"');
            return BackupHelper.getBackupPath(project, timestamp);
        }).then((path) => {
            onMessage('Restore backup "' + timestamp + '"');
            return BackupHelper.restoreBackup(project, timestamp);
        }).then((path) => {
            onMessage('Delete backup "' + timestamp + '"');
            return BackupHelper.deleteBackup(project, timestamp);
        });
    }

    /**
     * ConnectionHelper test
     *
     * @param {String} project
     * @param {String} environment
     * @param {Function} onMessage
     *
     * @returns {Promise}
     */
    static testConnectionHelper(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        onMessage = requiredParam('onMessage')
    ) {
        onMessage('Create connection')
        return ConnectionHelper.createConnection(project, environment)
        .then((testConnection) => {
            onMessage('Get connection by id "' + testConnection.id + '"');
            return ConnectionHelper.getConnectionById(project, environment, testConnection.id);
        })
        .then((testConnection) => {
            onMessage('Update connection by id "' + testConnection.id + '"');
            return ConnectionHelper.setConnectionById(project, environment, testConnection.id, testConnection, false);
        })
        .then((testConnection) => {
            onMessage('Remove connection by id "' + testConnection.id + '"');
            return ConnectionHelper.removeConnectionById(project, environment, testConnection.id);
        })
        .then(() => {   
            onMessage('Get all connections');
            return ConnectionHelper.getAllConnections(project, environment)
        });
    }

    /**
     * FormHelper test
     *
     * @param {String} project
     * @param {String} environment
     * @param {Function} onMessage
     *
     * @returns {Promise}
     */
    static testFormHelper(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        onMessage = requiredParam('onMessage')
    ) {
        onMessage('Create form')
        return FormHelper.createForm(project, environment)
        .then((testForm) => {
            onMessage('Get form by id "' + testForm.id + '"');
            return FormHelper.getForm(project, environment, testForm.id);
        })
        .then((testForm) => {
            onMessage('Update form by id "' + testForm.id + '"');
            return FormHelper.setForm(project, environment, testForm.id, testForm, false);
        })
        .then((testForm) => {
            onMessage('Add entry to form "' + testForm.id + '"');
            return FormHelper.addEntry(project, environment, testForm.id, {});
        })
        .then((testForm) => {
            onMessage('Remove form by id "' + testForm.id + '"');
            return FormHelper.deleteForm(project, environment, testForm.id);
        })
        .then(() => {   
            onMessage('Get all forms');
            return FormHelper.getAllForms(project, environment)
        });
    }

    /**
     * ContentHelper test
     *
     * @param {String} project
     * @param {String} environment
     * @param {User} user
     * @param {Function} onMessage
     *
     * @returns {Promise}
     */
    static testContentHelper(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        user = requiredParam('user'),
        onMessage = requiredParam('onMessage')
    ) {
        onMessage('Create content');
        return ContentHelper.createContent(
            project,
            environment,
            'contentBase',
            null,
            user
        ).then((testContent) => {
            onMessage('Get content by id "' + testContent.id + '"');
            return ContentHelper.getContentById(project, environment, testContent.id);
        })
        .then((testContent) => {
            onMessage('Update content by id "' + testContent.id + '"');
            return ContentHelper.setContentById(project, environment, testContent.id, testContent, user);
        })
        .then((testContent) => {
            onMessage('Remove content by id "' + testContent.id + '"');
            return ContentHelper.removeContentById(project, environment, testContent.id);
        })
        .then(() => {   
            onMessage('Get all contents');
            return ContentHelper.getAllContents(project, environment)
        });
    }
    
    /**
     * ProjectHelper test
     *
     * @param {User} user
     * @param {Function} onMessage
     *
     * @returns {Promise}
     */
    static testProjectHelper(
        user = requiredParam('user'),
        onMessage = requiredParam('onMessage')
    ) {
        let testProject;

        onMessage('Create project "Tæ$tp_r ojéct"');
        return ProjectHelper.createProject('Tæ$tp_r ojéct', user.id)
        .then((newProject) => {
            testProject = newProject;

            onMessage('Get project by id "' + testProject.id + '"');
            return ProjectHelper.getProject(testProject.id);
        })
        .then(() => {
            onMessage('Add environment to project "' + testProject.id + '"');
            return ProjectHelper.addEnvironment(testProject.id, 'testenvironment');
        })
        .then((testEnvironment) => {
            onMessage('Remove environment from project "' + testProject.id  + '"');
            return ProjectHelper.deleteEnvironment(testProject.id, testEnvironment);
        })
        .then(() => {
            onMessage('Get all environments from project "' + testProject.id  + '"');
            return ProjectHelper.getAllEnvironments(testProject.id);
        })
        .then(() => {
            onMessage('Delete project "' + testProject.id  + '"');
            return ProjectHelper.deleteProject(testProject.id, false);
        });
    }

    /**
     * SchemaHelper test
     *
     * @param {String} project
     * @param {String} environment
     * @param {Function} onMessage
     *
     * @returns {Promise}
     */
    static testSchemaHelper(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        onMessage = requiredParam('onMessage')
    ) {
        onMessage('Get native schemas');
        return SchemaHelper.getNativeSchemas()
        .then((nativeSchemas) => {
            let contentBase;

            for(let i in nativeSchemas) {
                if(nativeSchemas[i].id === 'contentBase') {
                    contentBase = nativeSchemas[i];
                    break;
                }
            }

            onMessage('Create schema')
            return SchemaHelper.createSchema(
                project,
                environment,
                contentBase
            );
        })
        .then((testSchema) => {
            onMessage('Get schema by id "' + testSchema.id + '"');
            return SchemaHelper.getSchemaWithParentFields(project, environment, testSchema.id);
        })
        .then((testSchema) => {
            onMessage('Update schema by id "' + testSchema.id + '"');
            return SchemaHelper.setSchemaById(project, environment, testSchema.id, testSchema, false);
        })
        .then((testSchema) => {
            onMessage('Remove schema by id "' + testSchema.id + '"');
            return SchemaHelper.removeSchemaById(project, environment, testSchema.id);
        })
        .then(() => {   
            onMessage('Get all schemas');
            return SchemaHelper.getAllSchemas(project, environment)
        });
    }
}

module.exports = TestHelper;
