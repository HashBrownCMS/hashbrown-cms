'use strict';

/**
 * uischema.org processor
 *
 * @memberof HashBrown.Server.Entity
 */
class UISchemaProcessor extends HashBrown.Entity.Processor.ProcessorBase {
    static get title() { return 'uischema.org'; }
    static get alias() { return 'uischema'; }

    /**
     * Performs a value check
     *
     * @param {String} project
     * @param {String} environment
     * @param {*} value
     * @param {String} schemaId
     *
     * @return {*} Value
     */
    async check(project, environment, value, schemaId) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        
        if(!value || !schemaId) { return value; }

        // Process array
        if(Array.isArray(value)) {
            for(let i in value) {
                value[i] = await this.check(project, environment, value[i].value, value[i].schemaId); 
            }
        
        // Process array items, if they are structs
        } else {
            let schema = await HashBrown.Service.SchemaService.getSchemaById(project, environment, schemaId, true);

            if(!schema.config || !schema.config.struct) { return value; }

            let parsed = {};
           
            for(let k in schema.config.struct) {
                parsed[k] = await this.check(project, environment, value[k], schema.config.struct[k].schemaId);
            }
            
            parsed['@type'] = schemaId[0].toUpperCase() + schemaId.substring(1);

            value = parsed;
        }

        return value;
    }

    /**
     * Compiles content as uischema.org JSON
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
        checkParam(content, 'content', HashBrown.Entity.Resource.Content);
        checkParam(language, 'language', String);

        let schema = await HashBrown.Service.SchemaService.getSchemaById(project, environment, content.schemaId, true);
        let properties = content.getLocalizedProperties(language);
        let meta = content.getMeta();

        if(!properties) {
            throw new Error('No properties for content "' + content.id + '" with language "' + language + '"');
        }

        debug.log('Processing "' + properties.title + '" as uischema.org JSON...', this);

        let createdBy = await HashBrown.Service.UserService.getUserById(meta.createdBy);
        let updatedBy = await HashBrown.Service.UserService.getUserById(meta.updatedBy);

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
            if(!schema.fields.properties[k]) { continue; }
            
            data[k] = await this.check(project, environment, properties[k], schema.fields.properties[k].schemaId);
        }
        
        for(let k in meta) {
            data[k] = meta[k];
        }

        return data;
    }
}

module.exports = UISchemaProcessor;
