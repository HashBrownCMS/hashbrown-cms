'use strict';

/**
 * A reference to any resource
 *
 * @memberof HashBrown.Client.Entity.View.Field
 */
class ResourceReferenceEditor extends HashBrown.Entity.View.Field.FieldBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.model.innerTemplate = require('template/field/inc/resourceReferenceEditor');
    }

    /**
     * Fetches the model
     */
    async fetch() {
        await super.fetch();
        
        if(this.model.config.resource && this.state.value) {
            this.state.resource = await HashBrown.Service.ResourceService.get(null, this.model.config.resource, this.state.value); 
        }

        this.state.label = this.getValueLabel();
    }

    /**
     * Gets the value label
     *
     * @return {String} Label
     */
    getValueLabel() {
        let label = '';

        if(this.state.resource) {
            for(let key of (this.model.config.resourceKeys || [])) {
                if(this.state.resource[key]) {
                    return this.state.resource[key];
                }
            }

        } else if(this.state.value) {
            let singularResourceName = this.model.config.resource;

            if(singularResourceName[singularResourceName.length - 1] == 's') {
                singularResourceName = singularResourceName.substring(0, singularResourceName.length - 1);
            }

            return '(' + singularResourceName + ' not found)';
        }
       
        return super.getValueLabel();
    }
}

module.exports = ResourceReferenceEditor;
