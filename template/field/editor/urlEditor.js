'use strict';

module.exports = (_, model, state) =>

_.div({class: 'widget-group'},
    _.input({disabled: model.isDisabled, class: 'widget widget--text', name: 'input', value: state.value, onchange: (e) => _.onChange(e.target.value)}),
    _.button({disabled: model.isDisabled, class: 'widget widget--button small default fa fa-refresh', title: 'Regenerate URL', onclick: _.onClickRegenerate}) 
)
