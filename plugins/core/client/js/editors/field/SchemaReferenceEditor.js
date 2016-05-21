'use strict';

class SchemaReferenceEditor extends View {
    constructor(params) {
        super(params);
        
        this.init();
    }

    /**
     * Event: Change input
     */
    onChange() {
        this.trigger('change', this.$select.val());
    }

    /**
     * Gets schema types
     */
    getSchemaTypes() {
        let allSchemas = window.resources.schemas;
        let types = {};

        for(let id in allSchemas) {
            let schema = allSchemas[id];

            if(!types[schema.schemaType]) {
                types[schema.schemaType] = [];
            }
            
            types[schema.schemaType].push(schema);
        }

        return types;
    }

    render() {
        var editor = this;
        
        this.$element = _.div({class: 'field-editor schema-reference-editor'},
            this.$select = _.select({class: 'form-control'},
                _.each(this.getSchemaTypes(), function(type, schemas) {
                    return _.optgroup({label: type},
                        _.each(schemas, function(i, schema) {
                            return _.option({value: schema.id}, schema.name);
                        })
                    );
                })
            ).change(function() { editor.onChange(); })
        );

        this.$select.val(editor.value);
    }
}

resources.editors.schemaReference = SchemaReferenceEditor;
