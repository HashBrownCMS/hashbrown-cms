'use strict';

/**
 * JSON processor
 *
 * @memberof HashBrown.Server.Entity
 */
class JsonProcessor extends HashBrown.Entity.Processor.ProcessorBase {
    /**
     * Compiles content as JSON
     *
     * @param {Content} content
     * @param {String} language
     *
     * @returns {Promise} Result
     */
    async process(content, language) {
        checkParam(content, 'content', HashBrown.Entity.Resource.Content, true);
        checkParam(language, 'language', String);

        let properties = content.getLocalizedProperties(language);
        let meta = content.getMeta();

        if(!properties) {
            throw new Error(`No properties for content "${content.getName()}" with language "${language}"`);
        }

        let createdBy = await content.getCreatedBy();
        let updatedBy = await content.getUpdatedBy();

        // We'll have to a allow unknown authors, as they could disappear between backups
        if(!createdBy) {
            createdBy = HashBrown.Entity.User.new({
                fullName: 'Unknown',
                username: 'unknown'
            });
        }

        if(!updatedBy) {
            updatedBy = HashBrown.Entity.User.new({
                fullName: 'Unknown',
                username: 'unknown'
            });
        }

        meta.createdBy = createdBy.getName();
        meta.updatedBy = updatedBy.getName();
        meta.language = language;

        // Combine all data into one
        let data = {};

        for(let k in properties) {
            data[k] = properties[k];
        }
        
        for(let k in meta) {
            data[k] = meta[k];
        }

        return data;
    }
}

module.exports = JsonProcessor;
