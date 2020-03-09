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
            let schema = await HashBrown.Entity.Resource.FieldSchema.get(project, environment, schemaId, { withParentFields: true });

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
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(content, 'content', HashBrown.Entity.Resource.Content, true);
        checkParam(language, 'language', String);

        let schema = await content.getSchema();
        let properties = content.getLocalizedProperties(language);
        let meta = content.getMeta();

        if(!properties) {
            throw new Error(`No properties for content "${content.getName()}" with language "${language}"`);
        }

        let createdBy = await content.getCreatedBy();
        let updatedBy = await content.getUpdatedBy();

        // We'll have to a allow unknown authors, as they could disappear between backups
        if(!createdBy) {
            createdBy = new HashBrown.Entity.User({
                fullName: 'Unknown',
                username: 'unknown'
            });
        }

        if(!updatedBy) {
            updatedBy = new HashBrown.Entity.User({
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
