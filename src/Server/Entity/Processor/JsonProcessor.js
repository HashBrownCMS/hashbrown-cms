'use strict';

/**
 * JSON processor
 *
 * @memberof HashBrown.Server.Entity
 */
class JsonProcessor extends HashBrown.Entity.Processor.ProcessorBase {
    static get title() { return 'JSON'; }
    static get alias() { return 'json'; }
    
    /**
     * Compiles content as JSON
     *
     * @param {String} project
     * @param {String} environment
     * @param {Content} content
     * @param {String} language
     *
     * @returns {Promise} Result
     */
    async process(project, environment, content, language) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

        let properties = content.getLocalizedProperties(language);
        let meta = content.getMeta();

        if(!properties) {
            return Promise.reject(new Error('No properties for content "' + content.id + '" with language "' + language + '"'));
        }

        debug.log('Processing "' + properties.title + '" as JSON...', this);

        let createdBy;
        let updatedBy;

        // Get created by user
        return HashBrown.Service.UserService.getUserById(meta.createdBy)
        .then((user) => {
            createdBy = user;

            return HashBrown.Service.UserService.getUserById(meta.updatedBy);
        })
        // Get updated by user
        .then((user) => {
            updatedBy = user;
            
            // We'll have to a allow unknown authors, as they could disappear between backups
            if(!createdBy) {
                createdBy = {
                    fullName: 'Unknown',
                    username: 'unknown'
                };
            }

            if(!updatedBy) {
                updatedBy = {
                    fullName: 'Unknown',
                    username: 'unknown'
                };
            }

            meta.createdBy = createdBy.fullName || createdBy.username;
            meta.updatedBy = updatedBy.fullName || createdBy.username;
            meta.language = language;

            // Combine all data into one
            let data = {};

            for(let k in properties) {
                data[k] = properties[k];
            }
            
            for(let k in meta) {
                data[k] = meta[k];
            }

            return Promise.resolve(data);
        });
    }
}

module.exports = JsonProcessor;
