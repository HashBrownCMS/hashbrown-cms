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
     * @param {*} value
     * @param {String} schemaId
     * @param {Object} config
     * @param {String} locale
     * @param {Array} excludeTypes
     *
     * @return {*} Value
     */
    async check(value, schemaId, config, locale, excludeTypes) {
        if(value === null || value === undefined || value === '') { return null; }

        if(!schemaId) { return value; }
        
        // Load schema
        let schema = await HashBrown.Entity.Resource.FieldSchema.get(this.context, schemaId, { withParentFields: true });

        if(!schema) { return value; }
        
        if(excludeTypes && excludeTypes.indexOf(schema.baseId) > -1) {
            if(schema.baseId === 'array') { return []; }
            if(schema.baseId === 'struct') { return {}; }

            return null;
        }

        // Ensure and merge schema config
        if(!config) { config = {}; }
        
        if(schema.config) {
            for(let k in schema.config) {
                if(config[k]) { continue; }

                config[k] = schema.config[k];
            }
        }

        // Parse value
        let parsed = {};

        switch(schema.baseId) {
            default:
                parsed = value;
                break;
            
            case 'array':
                parsed['@type'] = 'ItemList';
                parsed['numberOfItems'] = value.length;
                parsed['itemListElement'] = [];

                for(let i  = 0; i < value.length; i++) {
                    parsed['itemListElement'].push({
                        '@type': 'ItemListElement',
                        'position': i,
                        'item': await this.check(value[i].value, value[i].schemaId, null, locale)
                    });
                }
                break;

            case 'struct':
                parsed['@type'] = schema.id && schema.id !== 'struct' ? schema.id : 'StructuredValue';

                for(let k in value) {
                    if(!config.struct || !config.struct[k] || !config.struct[k].schemaId) { continue; }

                    parsed[k] = await this.check(value[k], config.struct[k].schemaId, config.struct[k].config, locale);
                }
                break;

            case 'mediaReference':
                if(typeof value !== 'string') { return null; }

                let media = await HashBrown.Entity.Resource.Media.get(this.context, value);

                if(!media) { return null; }

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

                parsed['identifier'] = media.id;
                parsed['author'] = media.author;

                if(parsed['author']) {
                    parsed['author']['@type'] = 'Person';
                }
                
                parsed['copyrightHolder'] = media.copyrightHolder;

                if(parsed['copyrightHolder']) {
                    parsed['copyrightHolder']['@type'] = 'Organization';
                }

                parsed['copyrightYear'] = media.copyrightYear;

                parsed['name'] = media.filename;
                parsed['contentUrl'] = await media.getContentUrl(true);
                parsed['thumbnailUrl'] = await media.getThumbnailUrl(true);
                break;

            case 'contentReference':
                if(typeof value !== 'string') { return null; }

                let content = await HashBrown.Entity.Resource.Content.get(this.context, value);
               
                // NOTE: We're excluding arrays, structs and content references to prevent infinite recursion
                content = await this.process(content, locale, ['array', 'struct', 'contentReference']);
        
                for(let key in content) {
                    parsed[key] = content[key];
                }

                break;
        }
       
        return parsed;
    }

    /**
     * Compiles content as uischema.org JSON
     *
     * @param {Content} content
     * @param {String} locale
     * @param {Array} excludeTypes
     *
     * @returns {Promise} Result
     */
    async process(content, locale = 'en', excludeTypes = []) {
        checkParam(content, 'content', HashBrown.Entity.Resource.Content, true);
        checkParam(locale, 'locale', String, true);
        checkParam(excludeTypes, 'excludeTypes', Array, true);

        let schema = await HashBrown.Entity.Resource.ContentSchema.get(this.context, content.schemaId, { withParentFields: true });
        let properties = await content.getLocalizedProperties(locale);

        if(!properties) {
            throw new Error(`No properties for content "${content.getName()}" with locale "${locale}"`);
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
       
        data['@type'] = schema.id;
        data['identifier'] = content.id;
        data['parentIdentifier'] = content.parentId;
        
        for(let key in schema.config) {
            data[key] = await this.check(
                properties[key],
                schema.config[key].schemaId,
                schema.config[key].config,
                locale,
                excludeTypes
            );
        }
       
        if(!data.name && data.title !== undefined) {
            data.name = data.title;
            delete data.title;
        }

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

        data.inLanguage = locale;

        data.dateCreated = content.createdOn;
        data.dateModified = content.updatedOn;
        data.datePublished = content.updatedOn;
        
        return data;
    }
}

module.exports = UISchemaProcessor;
