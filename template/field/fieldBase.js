'use strict';

module.exports = (_, model, state) =>

_.div({class: `field ${state.className || ''}`},
    state.name === 'error' ? [
        state.message
    
    ] : [
        model.label || model.description ? [
            _.div({class: 'field__key'},
                _.div({class: 'field__key__label'}, model.label),
                _.div({class: 'field__key__description'}, model.description)
            )
        
        ] : null,

        _.div({class: 'field__tools'},
            _.each(state.tools, (i, tool) =>
                _.button({class: `widget widget--button default small field__tool fa fa-${tool.icon || ''}`, title: tool.tooltip, onclick: tool.handler})
            )
        ),
        
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
