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

        this.editorTemplate = require('template/field/editor/resourceReferenceEditor');
        this.configTemplate = require('template/field/config/resourceReferenceEditor');
    }

    /**
     * Fetches the model
     */
    async fetch() {
        if(this.state.name === 'config') {
            this.state.categoryOptions = HashBrown.Service.ResourceService.getResourceCategoryNames();
            this.state.keyOptions = [];

            if(this.model.config.resource) {
                for(let type of Object.values(HashBrown.Entity.Resource)) {
                    if(type.category === this.model.config.resource) {
                        for(let key of Object.keys(new type())) {
                            this.state.keyOptions.push(key);
                        }
                        break;
                    }
                }
            }

        } else {
            if(this.model.config.resource && this.state.value) {
                this.state.resource = await HashBrown.Service.ResourceService.get(null, this.model.config.resource, this.state.value); 
            }

            this.state.label = this.getValueLabel();
        }
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

    /**
     * Event: Change resource category
     */
    onChangeResourceCategory(newValue) {
        this.model.config.resource = newValue;
        this.model.config.resourceKeys = [];

        this.onChange();
        this.update();
    }

    /**
     * Event: Change resource keys
     */
    onChangeResourceKeys(newValue) {
        this.model.config.resourceKeys = newValue;
    
        this.onChange();
    }
}

module.exports = ResourceReferenceEditor;
