'use strict';

const ContentHelper = require('Server/Helpers/ContentHelper');
const SchemaHelper = require('Server/Helpers/SchemaHelper');

/**
 * The helpers class for system tests
 *
 * TODO: Create tests for these helpers:
 *  BackupHelper
 *  ConfigHelper
 *  ConnectionHelper
 *  FormHelper
 *  LanguageHelper
 *  MediaHelper
 *  PluginHelper
 *  ProjectHelper
 *  RequestHelper
 *  ScheduleHelper
 *  SettingsHelper
 *  SyncHelper
 *  UpdateHelper
 *  UserHelper
 *
 * @memberof HashBrown.Server.Helpers
 */
class TestHelper {
    /**
     * Content test
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
        onMessage('Create content')
        return ContentHelper.createContent(
            project,
            environment,
            'contentBase',
            null,
            user
        )
        .then((testContent) => {
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
     * Schema test
     *
     * @param {String} project
     * @param {String} environment
     * @param {User} user
     * @param {Function} onMessage
     *
     * @returns {Promise}
     */
    static testSchemaHelper(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        user = requiredParam('user'),
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
