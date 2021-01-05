'use strict';

module.exports = (_, model, state) =>

_.div({class: `field ${state.className || ''} ${model.separator !== false ? 'separator' : ''} ${state.isFullscreen ? 'fullscreen' : ''}`},
    state.name === 'error' ? [
        state.message
    
    ] : [
        !state.hideKey && (model.label || model.description) ? [
            _.div({class: 'field__key'},
                _[model.size ? `h${model.size}` : 'div']({localized: model.localized, class: 'field__key__label'},
                    model.label,
                    model.isLocalized ? _.span({localized: true, class: 'field__key__label__icon fa fa-flag', title: 'This field is localised'}) : null,
                ),
                _.div({localized: model.localized, class: 'field__key__description'}, model.description)
            )
        
        ] : null,

        _.div({class: 'field__content'}, 
            !state.hideTools ? [
                _.div({class: 'field__tools'},
                    state.isCollapsible && !state.isFullscreen ? [
                        _.button({localized: true, class: `widget widget--button default small field__tool fa fa-${state.isCollapsed ? 'caret-right' : 'caret-down'}`, title: state.isCollapsed ? 'Expand this field' : 'Collapse this field', onclick: _.onToggleCollapsed})

                    ] : null,

                    !state.isCollapsed ? [
                        _.each(state.tools || model.tools, (name, tool) =>
                            _.button({localized: true, class: `widget widget--button default small field__tool fa fa-${tool.icon || ''}`, name: name, title: tool.tooltip, onclick: tool.handler})
                        )
                    ] : null
                )

            ] : null,
            
            _.div({class: 'field__value'},
                state.isCollapsed ? [
                    _.div({class: 'field__value__label'}, 
                        state.icon ? [
                            _.span({class: `field__value__label__icon fa fa-${state.icon}`})
                        ] : null,
                        state.label
                    )

                ] : state.name === 'config' ? [
                    _.include(state.configTemplate)

                ] : [
                    _.include(state.editorTemplate)

                ]
            )
        )
    ]
)
