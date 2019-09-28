'use strict';

module.exports = (_, model, state) => [

_.field({label: 'Label', description: 'Value to represent this struct when collapsed'},
    _.popup({disabled: model.isLocked, name: 'label', value: model.config.label, options: state.labelOptions, onchange: _.onChangeConfig})
),
!state.isEditing ?
    _.field({label: 'Fields'},
        _.list({disabled: model.isLocked, readonly: true, value: state.fields, sortable: true, onchange: _.onChangeFieldSorting})
    )
: 
    _.each(state.fields, (i, field) =>
        _.field({label: field.definition.label || field.key},
            _.field({label: 'Key'},
                _.text({disabled: model.isLocked, value: field.key, onchange: (newValue) => _.onChangeConfigStructKey(field.key, newValue)})
            ),
            _.field({label: 'Label'},
                _.text({disabled: model.isLocked, value: field.definition.label, onchange: (newValue) => _.onChangeConfigStructValue(field.key, 'label', newValue)})
            ),
            _.field({label: 'Description'},
                _.text({disabled: model.isLocked, value: field.definition.description, onchange: (newValue) => _.onChangeConfigStructValue(field.key, 'description', newValue)})
            ),
            _.field({label: 'Multilingual'},
                _.checkbox({disabled: model.isLocked, value: field.definition.multilingual, onchange: (newValue) => _.onChangeConfigStructValue(field.key, 'multilingual', newValue)})
            ),
            _.field({label: 'Schema'},
                _.popup({disabled: model.isLocked, options: state.schemaOptions, value: field.definition.schemaId, onchange: (newValue) => _.onChangeConfigStructValue(field.key, 'schemaId', newValue)})
            ),
            field.config
        )
    )
]
