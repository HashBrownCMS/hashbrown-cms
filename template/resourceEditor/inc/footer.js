'use strict';

module.exports = (_, model, state) =>

state.tab !== 'overview' ? [
    _.div({class: 'resource-editor__footer'},
        _.details({class: 'resource-editor__footer__warning'},
            state.warning ? [
                _.p({class: 'resource-editor__footer__warning__message'}, state.warning),
                _.summary({class: 'resource-editor__footer__warning__icon fa fa-exclamation-circle'})
            ] : null
        ),
        _.div({class: 'resource-editor__footer__actions'},
            model ? [
                _.a({href: `#/${state.module}/${state.id}/json`, class: 'widget widget--button embedded'}, 'Advanced'),
                !model.isLocked ? [
                    state.visibleSaveOptions && Object.keys(state.visibleSaveOptions).length > 0 ? [
                        _.div({class: 'widget-group'},
                            _.button({class: 'widget widget--button', name: 'save', onclick: _.onClickSave}, 'Save'),
                            _.each(state.visibleSaveOptions, (name, label) =>
                                _.checkbox({value: model[name], class: 'large', placeholder: label, onchange: (newValue) => { _.onChangeValue(name, newValue); } })
                            )
                        )
                    ] : [
                        _.button({class: 'widget widget--button', onclick: _.onClickSave}, 'Save')
                    ]
                ] : null
            ] : state.tab === 'settings' ? [
                _.button({class: 'widget widget--button', onclick: _.onClickSaveSettings}, 'Save')
            ] : null
        )
    )
] : null
