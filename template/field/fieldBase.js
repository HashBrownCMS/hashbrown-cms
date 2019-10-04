'use strict';

module.exports = (_, model, state) =>

_.div({class: `field ${state.className || ''}`},
    state.name === 'error' ? [
        state.message
    
    ] : [
        !state.hideKey && (model.label || model.description) ? [
            _.div({class: 'field__key'},
                _.div({class: 'field__key__label'}, model.label),
                _.div({class: 'field__key__description'}, model.description)
            )
        
        ] : null,

        !state.hideTools ? [
            _.div({class: 'field__tools'},
                model.isCollapsible ? [
                    _.button({class: `widget widget--button default small field__tool fa fa-${state.isCollapsed ? 'caret-right' : 'caret-down'}`, title: state.isCollapsed ? 'Expand this field' : 'Collapse this field', onclick: _.onToggleCollapsed})

                ] : null,

                _.each(state.tools, (i, tool) =>
                    _.button({class: `widget widget--button default small field__tool fa fa-${tool.icon || ''}`, title: tool.tooltip, onclick: tool.handler})
                )
            )

        ] : null,
        
        _.div({class: 'field__value'},
            state.isCollapsed ? [
                _.div({class: 'field__value__label'}, state.label)
            
            ] : state.name === 'config' ? [
                _.include(state.configTemplate)

            ] : [
                _.include(state.editorTemplate)

            ]
        )
    ]
)
