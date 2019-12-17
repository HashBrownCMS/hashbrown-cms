'use strict';

module.exports = (_, model, state) => [

_.field({label: 'Label', description: 'Value to represent this struct when collapsed'},
    _.popup({disabled: model.isLocked, name: 'label', value: model.config.label, options: state.labelOptions, onchange: _.onChangeConfig})
),
_.field({label: 'Fields'},
    _.list({disabled: model.isLocked, readonly: true, value: state.fields, sortable: true, placeholder: 'field', onchange: _.onChangeFieldSorting, onclick: _.onClickEditField})
)

]
