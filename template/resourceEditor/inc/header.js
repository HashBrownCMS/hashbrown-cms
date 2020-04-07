'use strict';

module.exports = (_, model, state) =>

_.div({class: 'resource-editor__header'},
    _.div({class: 'resource-editor__header__title'},
        _.span({class: `resource-editor__header__title__icon fa fa-${state.icon}`}),
        state.title
    ),
   state.tabs && Object.keys(state.tabs).length > 0 ? [
        _.div({class: 'resource-editor__header__tabs'},
            _.each(state.tabs, (alias, title) => 
                _.a({href: `#/${state.category}${state.id ? `/${state.id}` : ''}/${alias}`, class: `resource-editor__header__tab ${state.tab === alias ? 'active' : ''}`, onclick: (e) => _.onClickTab(alias)}, title)
            )
        ),
        _.div({class: 'resource-editor__header__spacer'}),
   ] : null
)
