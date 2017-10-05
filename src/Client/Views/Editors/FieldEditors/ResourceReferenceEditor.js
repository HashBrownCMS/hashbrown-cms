'use strict';

const FieldEditor = require('./FieldEditor');

/**
 * A simple string editor
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */
class ResourceReferenceEditor extends FieldEditor {
    constructor(params) {
        super(params);

        this.init();
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
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'}, 'Resource'),
                _.div({class: 'editor__field__value'},
                    new HashBrown.Views.Widgets.Dropdown({
                        value: config.resource,
                        options: Object.keys(resources),
                        onChange: (newValue) => {
                            config.resource = newValue
                        }
                    }).$element
                )
            ),
            _.div({class: 'editor__field'},
                _.div({class: 'editor__field__key'}, 'Resource keys'),
                _.div({class: 'editor__field__value'},
                    new HashBrown.Views.Widgets.Chips({
                        value: config.resourceKeys,
                        placeholder: 'keyName',
                        onChange: (newValue) => {
                            config.resourceKeys = newValue;
                        }
                    }).$element
                )
            )
        ];
    }

    /**
     * Renders this editor
     */
    template() {
        let resource = resources[this.config.resource];
        let value;

        if(resource) {
            value = resource[this.value];

            if(!value) {
                for(let i in resource) {
                    if(resource[i].id == this.value) {
                        value = resource[i];
                        break;
                    }
                }
            }

            if(value) {
                for(let key of (this.config.resourceKeys || [])) {
                    if(value[key]) {
                        value = value[key];
                        break;    
                    }
                }

            } else if(this.value) {
                let singularResourceName = this.config.resource;

                if(singularResourceName[singularResourceName.length - 1] == 's') {
                    singularResourceName = singularResourceName.substring(0, singularResourceName.length - 1);
                }

                value = '(' + singularResourceName + ' not found)';

            }
        }
        
        return _.div({class: 'editor__field__value'},
            value || '(none)'
        );
    }
}

module.exports = ResourceReferenceEditor;
