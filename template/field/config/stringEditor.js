'use strict';

module.exports = (_, model, state) => 

_.field({label: 'Is multiple lines'},
    _.checkbox({disabled: model.isLocked, name: 'isMultiLine', value: model.config.isMultiLine || false, onchange: _.onChangeConfig})
)
