'use strict';

module.exports = (_, model, state) =>

_.div({title: state.tooltip, class: `widget widget--popup ${state.color || ''}`, role: state.role},
    _.if(state.icon && !state.label,
        _.button({class: `widget--popup__icon fa fa-${state.icon}`, onclick: _.onClickToggle})
    ),
    _.if(state.label,
        _.button({class: 'widget--popup__label', onclick: _.onClickToggle},
            _.if(state.icon,
                _.span({class: `fa fa-${state.icon}`})
            ),
            typeof state.label === 'function' ? state.label(model) : state.label
        )
    ),
    _.if(!state.icon && !state.label,
        _.div({class: 'widget-group'},
            _.button({class: 'widget--popup__value widget widget--input text', onclick: _.onClickToggle}, state.value),
            _.if(state.clearable,
                _.button({class: 'widget widget--button small fa fa-remove', title: 'Clear selection', onclick: _.onClickClearValue})
            )
        )
    ),
    _.if(state.isOpen,
        _.div({class: 'widget--popup__menu'},
            _.if(state.autocomplete,
                _.div({class: 'widget-group widget--popup__search'},
                    _.input({class: 'widget--popup__search__input', value: state.searchQuery, type: 'text', oninput: (e) => _.onSearch(e.currentTarget.value)}),
                    _.button({class: 'widget--popup__search__clear fa fa-remove', title: 'Clear search', onclick: _.onClickClearSearch})
                )
            ),
            _.div({class: 'widget--popup__options'},
                _.each(state.options, (label, value) =>
                    value === null || value === undefined ? 
                        _.div({class: 'widget--popup__separator'}, label)
                    :
                        _.button({class: `widget--popup__option ${model === value || (Array.isArray(model) && model.indexOf(value) > -1) ? 'selected' : ''}`, onclick: (e) => _.onClickOption(value)}, Array.isArray(state.options) ? value : label)
                )
            )
        ),
        _.button({class: 'widget--popup__backdrop', onclick: _.onClickToggle})
    )
)
