'use strict';

module.exports = (_, model, state) =>

_.div({class: 'panel'},
    state.name === 'error' ?
        state.message
    :
        _.div({class: 'panel__filter'},
            _.div({class: 'widget-group'},
                _.text({oninput: (e) => _.onSearch(e.target.value)}),
                _.popup({options: state.sortingOptions, value: state.sortingMethod, onchange: _.onChangeSortingMethod})
            )
        ),
        _.div({class: 'panel__items'},
            state.rootItems,
            _.div({class: 'panel__context', oncontextmenu: _.onClickContext})
        )
)
