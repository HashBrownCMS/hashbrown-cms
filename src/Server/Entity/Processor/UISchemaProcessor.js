'use strict';

/**
 * uischema.org processor
 *
 * @memberof HashBrown.Server.Entity
 */
class UISchemaProcessor extends HashBrown.Entity.Processor.ProcessorBase {
    /**
     * Performs a value check
     *
     * @param {String} project
     * @param {String} environment
     * @param {*} value
     * @param {String} schemaId
     * @param {String} language
     *
     * @return {*} Value
     */
    async check(project, environment, value, schemaId, language) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        
        if(value === null || value === undefined || value === '') { return null; }

        if(Array.isArray(value)) {
            schemaId = 'array';
        }
        
        if(!schemaId) { return value; }

        let schema = await HashBrown.Entity.Resource.FieldSchema.get(project, environment, schemaId, { withParentFields: true });

        if(!schema) { return value; }

        if(schema.config && schema.config.struct) {
            schemaId = 'struct';
        }

        let parsed = {};

        switch(schemaId) {
            case 'array':
                parsed['@type'] = 'ItemList';
                parsed['numberOfItems'] = value.length;
                parsed['itemListElement'] = [];

                for(let i in value) {
                    parsed['itemListElement'].push({
                        '@type': 'ItemListElement',
                        'position': i,
                        'item': await this.check(project, environment, value[i].value, value[i].schemaId)
                    });
                }
                break;

            case 'struct':
                parsed['@type'] = 'StructuredValue';

                for(let k in value) {
                    parsed[k] = await this.check(project, environment, value[k], schema.config.struct[k].schemaId);
                }
                break;

            case 'mediaReference':
                let media = await HashBrown.Entity.Resource.Media.get(project, environment, value);

                if(media.isImage()) {
                    parsed['@type'] = 'ImageObject';
                } else if(media.isAudio()) {
                    parsed['@type'] = 'AudioObject';
                } else if(media.isVideo()) {
                    parsed['@type'] = 'VideoObject';
                } else if(media.isDocument()) {
                    parsed['@type'] = 'DataDownload';
                } else {
                    parsed['@type'] = 'MediaObject';
                }

                parsed['author'] = media.author;

                if(parsed['author']) {
                    parsed['author']['@type'] = 'Person';
                }
                
                parsed['copyrightHolder'] = media.copyrightHolder;

                if(parsed['copyrightHolder']) {
                    parsed['author']['@type'] = 'Organization';
                }

                parsed['copyrightYear'] = media.copyrightYear;

                parsed['contentUrl'] = media.contentUrl;
                parsed['thumbnailUrl'] = media.thumbnailUrl;
                break;

            case 'contentReference':
                let content = await HashBrown.Entity.Resource.Content.get(project, environment, value);
                
                content = await this.process(project, environment, content, language, [ 'url', 'description', 'image' ]);
        
                for(let key in content) {
                    parsed[key] = content[key];
                }
                break;

            default:
                parsed['@type'] = schemaId;
                break;
        }
        
        return parsed;
    }

    /**
     * Compiles content as uischema.org JSON
     *
     * @param {String} project
     * @param {String} environment
     * @param {Content} content
     * @param {String} language
     * @param {Array} filter
     *
     * @returns {Promise} Result
     */
    async process(project, environment, content, language = 'en', filter = []) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(content, 'content', HashBrown.Entity.Resource.Content, true);
        checkParam(language, 'language', String, true);
        checkParam(filter, 'filter', Array, true);

        let schema = await HashBrown.Entity.Resource.ContentSchema.get(project, environment, content.schemaId);
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


        // Combine all data into one
        let data = {};

        // TODO: Include images here?
        data.creator = {
            '@type': 'Person',
            name: createdBy.getName(),
            email: createdBy.email
        };

        data.author = {
            '@type': 'Person',
            name: updatedBy.getName(),
            email: updatedBy.email
        };

        data.inLanguage = language;

        data.dateCreated = content.createdOn;
        data.dateModified = content.updatedOn;
        data.datePublished = content.createdOn;

        for(let key in schema.config) {
            if(filter.length > 0 && filter.indexOf(key) < 0) { continue; }

            data[key] = await this.check(project, environment, properties[key], schema.config[key].schemaId, language);
        }
        
        return data;
    }
}

module.exports = UISchemaProcessor;
