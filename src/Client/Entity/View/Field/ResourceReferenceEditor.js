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
        await super.fetch();

        if(this.state.name === 'config') {
            this.state.libraryOptions = HashBrown.Service.LibraryService.getAliases();
            this.state.keyOptions = [];

            if(this.model.config.resource) {
                let model = HashBrown.Service.LibraryService.getClass(this.model.config.resource, HashBrown.Entity.Resource);

                if(model) {
                    for(let key of Object.keys(new model())) {
                        this.state.keyOptions.push(key);
                    }
                }
            }

        } else {
            if(this.model.config.resource && this.state.value) {
                let model = HashBrown.Service.LibraryService.getClass(this.model.config.resource, HashBrown.Entity.Resource);

                this.state.resource = model ? await model.get(this.state.value) : null;
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
     * Event: Change resource library
     */
    onChangeResourceLibrary(newValue) {
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
    
    /**
     * Gets whether this field is small
     *
     * @return {Boolean} Is small
     */
    isSmall() {
        return true;
    }
}

module.exports = ResourceReferenceEditor;
