'use strict';

module.exports = (_, model, state) =>

_.div({title: model.tooltip, class: `widget widget--popup ${model.color || ''}`, role: model.role},
    _.if(model.role !== 'context-menu',
        _.if(model.icon && !model.label,
            _.button({class: `widget--popup__icon fa fa-${model.icon}`, onclick: _.onClickToggle})
        ),
        _.if(model.label,
            _.button({class: 'widget--popup__label', onclick: _.onClickToggle},
                _.if(model.icon,
                    _.span({class: `fa fa-${model.icon}`})
                ),
                typeof model.label === 'function' ? model.label(model.value) : model.label
            )
        ),
        _.if(!model.icon && !model.label,
            _.div({class: 'widget-group'},
                _.button({class: 'widget--popup__value widget widget--text', onclick: _.onClickToggle}, state.value),
                _.if(model.clearable,
                    _.button({class: 'widget widget--button small fa fa-remove', title: 'Clear selection', onclick: _.onClickClearValue})
                )
            )
        )
    ),
    _.if(state.isOpen,
        _.div({class: 'widget--popup__menu'},
            _.if(model.autocomplete,
                _.div({class: 'widget--popup__search'},
                    _.input({type: 'text', class: 'widget--popup__search__input', value: state.searchQuery, oninput: (e) => _.onSearch(e.target.value)}),
                    _.button({class: 'widget--popup__search__clear fa fa-remove', title: 'Clear search', onclick: _.onClickClearSearch})
                )
            ),
            _.div({class: 'widget--popup__options'},
                _.each(model.options, (label, value) =>
                    value === null || value === undefined || value === '---' ? 
                        _.div({class: 'widget--popup__separator'}, label)
                    :
                        _.button({class: `widget--popup__option ${model.value === value || (Array.isArray(model.value) && model.value.indexOf(value) > -1) ? 'selected' : ''}`, onclick: (e) => _.onClickOption(value)}, Array.isArray(model.options) ? value : label)
                )
            )
        ),
        _.button({class: 'widget--popup__backdrop', onclick: _.onClickToggle, oncontextmenu: _.onClickToggle})
    )
)
