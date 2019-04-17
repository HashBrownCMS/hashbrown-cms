'use strict';

/**
 * A simple string editor
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */
class ResourceReferenceEditor extends HashBrown.Views.Editors.FieldEditors.FieldEditor {
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
                this.model = await HashBrown.Helpers.ResourceHelper.get(null, this.config.resource, this.value); 
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
                new HashBrown.Views.Widgets.Dropdown({
                    value: config.resource,
                    options: HashBrown.Helpers.ResourceHelper.getResourceNames(),
                    onChange: (newValue) => {
                        config.resource = newValue
                    }
                })
            ),
            this.field(
                'Resource keys',
                new HashBrown.Views.Widgets.Chips({
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
     * Renders this editor
     */
    template() {
        let displayValue = '';

        if(this.model) {
            for(let key of (this.config.resourceKeys || [])) {
                if(this.model[key]) {
                    displayValue = this.model[key];
                    break;    
                }
            }

        } else if(this.value) {
            let singularResourceName = this.config.resource;

            if(singularResourceName[singularResourceName.length - 1] == 's') {
                singularResourceName = singularResourceName.substring(0, singularResourceName.length - 1);
            }

            displayValue = '(' + singularResourceName + ' not found)';

        }
        
        return _.div({class: 'field-editor field-editor--resource-reference'},
            displayValue || '(none)'
        );
    }
}

module.exports = ResourceReferenceEditor;
