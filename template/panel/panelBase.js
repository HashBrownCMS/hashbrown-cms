'use strict';

module.exports = (_, model, state) =>

_.div({class: 'panel'},
    state.name === 'error' ?
        state.message
    :
        _.div({class: 'panel__tools'},
            _.search({tooltip: 'Search', class: 'widget-group panel__tools__search', value: state.searchQuery, onclear: _.onClickClearSearch, onsearch: _.onClickSearch}),
            state.sortingOptions && Object.values(state.sortingOptions).length > 1 ? [
                _.popup({tooltip: 'Sorting', class: 'panel__tools__sort', options: state.sortingOptions, color: 'secondary', value: state.sortingMethod, icon: 'sort', role: 'sorting', onchange: _.onChangeSortingMethod})
            ] : null
        ),
        _.div({class: 'panel__items', name: 'items'},
            state.rootItems,
            state.hasPanelContext ? [
                _.button({class: 'panel__context-button fa fa-ellipsis-h', onclick: _.onClickContext}),
                _.div({class: 'panel__context', oncontextmenu: _.onClickContext, ondrop: _.onDropItemOntoPanel, ondragover: _.onDragOverPanel})
            ] : null
        )
)
