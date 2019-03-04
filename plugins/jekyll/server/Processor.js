'use strict';

const Yaml = require('./lib/yamljs/Yaml');

class JekyllProcessor extends HashBrown.Models.Processor {
    // Getters
    static get name() { return 'Jekyll'; }
    static get alias() { return 'jekyll'; }
    
    /**
     * Compiles content for Jekyll
     *
     * @param {Content} content
     * @param {String} language
     *
     * @returns {Promise} Result
     */
    process(content, language) {
        checkParam(content, 'content', HashBrown.Models.Content);
        checkParam(language, 'language', String);

        let properties = content.getLocalizedProperties(language);
        let meta = content.getMeta();

        if(!properties) {
            return Promise.reject(new Error('No properties for content "' + content.id + '" with language "' + language + '"'));
        }

        debug.log('Processing "' + properties.title + '" for Jekyll...', this);

        let createdBy;
        let updatedBy;

        // Get created by user
        return HashBrown.Helpers.UserHelper.getUserById(meta.createdBy)
        .then((user) => {
            createdBy = user;

            return HashBrown.Helpers.UserHelper.getUserById(meta.updatedBy);
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

            // Format date string
            let dateString = '';
            
            dateString += meta.createDate.getFullYear() + '-';
            dateString += (meta.createDate.getMonth() + 1) + '-';
            dateString += meta.createDate.getDate();

            // Add meta data to the properties
            properties.meta = {
                id: meta.id,
                parentId: meta.parentId,
                language: language
            };

            // Date and author go in as main properties in Jekyll, not as meta
            properties.date = dateString;
            properties.author = updatedBy.fullName || updatedBy.username || createdBy.fullName || createdBy.username;

            // Remap "url" to "permalink"
            if(properties.url) {
                properties.permalink = properties.url;
                delete properties.url;
            }

            // Set the layout to the Schema id
            properties.layout = content.schemaId;

            let frontMatter = '';

            frontMatter += '---\n';
            frontMatter += Yaml.stringify(properties, 50); 
            frontMatter += '---';

            return Promise.resolve(frontMatter);
        });
    }
}

module.exports = JekyllProcessor;
