'use strict';

/**
 * A simple string editor
 *
 * @memberof HashBrown.Client.View.Editor.FieldEditor
 */
class ResourceReferenceEditor extends HashBrown.View.Editor.FieldEditor.FieldEditor {
    constructor(params) {
        super(params);

        this.fetch();
    }

    /**
     * Fetches the model
     */
    async fetch() {
        try {
            if(this.config.resource && this.value) {
                this.model = await HashBrown.Service.ResourceService.get(null, this.config.resource, this.value); 
            }

        } catch(e) {
            debug.log(e.message, this);
        
        } finally {
            super.fetch();

        }
    }

    /**
     * Renders the config editor
     *
     * @param {Object} config
     *
     * @returns {HTMLElement} Element
     */
    static renderConfigEditor(config) {
        config.resourceKeys = config.resourceKeys || [];

        return [
            this.field(
                'Resource',
                new HashBrown.View.Widget.Dropdown({
                    value: config.resource,
                    options: HashBrown.Service.ResourceService.getResourceCategoryNames(),
                    onChange: (newValue) => {
                        config.resource = newValue
                    }
                })
            ),
            this.field(
                'Resource keys',
                new HashBrown.View.Widget.Chips({
                    value: config.resourceKeys,
                    placeholder: 'keyName',
                    onChange: (newValue) => {
                        config.resourceKeys = newValue;
                    }
                })
            )
        ];
    }
    
    /**
     * Gets the field label
     *
     * @return {String} Label
     */
    getFieldLabel() {
        let label = '';

        if(this.model) {
            for(let key of (this.config.resourceKeys || [])) {
                if(this.model[key]) {
                    return this.model[key];
                }
            }

        } else if(this.value) {
            let singularResourceName = this.config.resource;

            if(singularResourceName[singularResourceName.length - 1] == 's') {
                singularResourceName = singularResourceName.substring(0, singularResourceName.length - 1);
            }

            return '(' + singularResourceName + ' not found)';
        }
       
        return super.getFieldLabel();
    }

    /**
     * Renders this editor
     */
    template() { 
        return _.div({class: 'field-editor field-editor--resource-reference'},
            this.getFieldLabel()
        );
    }
}

module.exports = ResourceReferenceEditor;
