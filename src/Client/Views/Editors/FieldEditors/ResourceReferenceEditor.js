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

        let $element = _.div();

        let render = () => {
            let isValidResource = config.resource && resources[config.resource] !== null;
            let keyOptions = [];
            let resourceOptions = [];

            for(let resourceName in window.resources) {
                resourceOptions.push({
                    value: resourceName,
                    label: resourceName
                });
            }

            if(!isValidResource) {
                config.resourceKeys = [];
            
            } else if(resources[config.resource].length > 0) {
                for(let resourceKey in resources[config.resource][0]) {
                    keyOptions.push({
                        label: resourceKey,
                        value: resourceKey
                    });
                }

            }

            _.append($element.empty(),
                _.div({class: 'field-container'},
                    _.div({class: 'field-key'}, 'Resource'),
                    _.div({class: 'field-value'},
                        UI.inputDropdown(config.resource, resourceOptions, (newValue) => {
                            config.resource = newValue;
                            config.resourceKeys = [];

                            render();
                        })
                    )
                ),
                _.if(isValidResource,
                    _.div({class: 'field-container'},
                        _.div({class: 'field-key'}, 'Resource keys'),
                        _.div({class: 'field-value'},
                            UI.inputChipGroup(config.resourceKeys, keyOptions, (newValue) => {
                                config.resourceKeys = newValue;
                            }, true)
                        )
                    )
                )
            )
        };

        render();

        return $element;
    }

    /**
     * Renders this editor
     */
    render() {
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
        
        this.$element = _.div({class: 'field-editor resource-reference-editor'},
            _.p(value || '(none)')
        );
    }
}

module.exports = ResourceReferenceEditor;
