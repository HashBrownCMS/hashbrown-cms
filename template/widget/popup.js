'use strict';

module.exports = (_, model, state) =>

_.div({title: model.tooltip, class: `widget widget--popup ${model.color || ''} ${model.class || ''}`, role: model.role, style: model.offset ? `left: ${model.offset.x}px; top: ${model.offset.y}px;` : null},
    model.role !== 'context-menu' ? [
        model.icon && !model.label ? [
            _.button({disabled: model.disabled, class: `widget--popup__icon fa fa-${model.icon}`, onclick: _.onClickToggle})
        
        ] : model.label ? [
            _.button({disabled: model.disabled, class: 'widget--popup__label', onclick: _.onClickToggle},
                model.icon ? [
                    _.span({class: `fa fa-${model.icon}`})
                ] : null,
                _.icon(typeof model.label === 'function' ? model.label(model.value) : model.label)
            )

        ] : [
            _.div({class: 'widget--popup__inner'},
                _.button({disabled: model.disabled, class: 'widget--popup__value', onclick: _.onClickToggle},
                    _.icon(state.value),
                    _.span({class: 'widget--popup__value__icon fa fa-chevron-down'})
                ),
                model.clearable ? [
                    _.button({disabled: model.disabled, class: 'widget--popup__clear fa fa-remove', title: 'Clear selection', onclick: _.onClickClearValue})
                
                ] : null
            )
        ]
    ] : null,

    state.isOpen && !model.disabled ? [
        _.div({class: 'widget--popup__menu'},
            model.autocomplete ? [
                _.div({class: 'widget--popup__search'},
                    _.input({type: 'text', class: 'widget--popup__search__input', value: state.searchQuery, oninput: (e) => _.onSearch(e.target.value)}),
                    _.button({class: 'widget--popup__search__clear fa fa-remove', title: 'Clear search', onclick: _.onClickClearSearch})
                )
            ] : null,
            _.div({class: 'widget--popup__options'},
                _.each(model.options, (label, value) =>
                    value === null || value === undefined || value === '---' ? 
                        _.div({class: 'widget--popup__separator'}, label)
                    :
                        _.button({class: `widget--popup__option ${model.value === value || (Array.isArray(model.value) && model.value.indexOf(value) > -1) ? 'selected' : ''}`, onclick: (e) => _.onClickOption(value)},
                            _.icon(Array.isArray(model.options) ? value : label)
                        )
                )
            )
        ),
        _.button({class: 'widget--popup__backdrop', onclick: _.onClickToggle, oncontextmenu: _.onClickToggle})
    ] : null
)
