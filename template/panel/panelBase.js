'use strict';

module.exports = (_, model, state) =>

_.div({class: 'panel'},
    state.name === 'error' ?
        state.message
    :
        _.div({class: 'panel__tools'},
            _.search({class: 'widget-group panel__tools__search', value: state.searchQuery, onclear: _.onClickClearSearch, onsearch: _.onClickSearch}),
            _.if(state.sortingOptions && Object.values(state.sortingOptions).length > 1,
                _.popup({class: 'panel__tools__sort', options: state.sortingOptions, value: state.sortingMethod, onchange: _.onChangeSortingMethod})
            )
        ),
        _.div({class: 'panel__items', name: 'items'},
            state.rootItems,
            _.div({class: 'panel__context', oncontextmenu: _.onClickContext, ondrop: _.onDropItemOntoPanel, ondragover: _.onDragOverPanel})
        )
)
