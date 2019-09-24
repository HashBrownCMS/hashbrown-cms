'use strict';

module.exports = (_, model, state) =>

_.div({class: 'navigation navigation--resource-browser'},
    _.div({class: 'navigation--resource-browser__tabs'},
        _.a({title: 'Go to dashboard', href: '/', class: 'navigation--resource-browser__logo'},
            state.logoSvg
        ),
        _.each(state.panels, (name, panel) =>
            _.a({title: panel.name, href: `#/${panel.category}/`, class: `navigation--resource-browser__tab fa fa-${panel.icon} ${state.panel instanceof panel ? 'active' : ''}`})
        )
    ),
    _.div({class: 'navigation--resource-browser__panels'},
        state.name === 'error' ?
            state.message
        :
            state.panel
    )
)
