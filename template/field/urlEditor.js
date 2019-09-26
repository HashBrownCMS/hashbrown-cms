'use strict';

module.exports = (_, model, state) =>

_.div({class: 'field field--url-editor'},
    _.if(state.name === 'error',
        state.message
    ),

    _.if(state.name === undefined,
        _.div({class: 'field__key'},
            _.div({class: 'field__key__label', title: model.key}, model.label),
            _.div({class: 'field__key__description'}, model.description)
        ),
        _.div({class: 'field__value widget-group'},
            _.input({disabled: model.isDisabled, class: 'widget widget--text', name: 'input', value: state.value, onchange: (e) => _.onChange(e.target.value)}),
            _.button({disabled: model.isDisabled, class: 'widget widget--button small default fa fa-refresh', title: 'Regenerate URL', onclick: _.onClickRegenerate}) 
        )
    )
)
