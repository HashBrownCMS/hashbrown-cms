'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal modal--pick-icon large in'},
    _.div({class: 'modal__dialog'},
        _.div({class: 'modal__header'},
            _.h4({class: 'modal__title'}, 'Pick an icon'),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({class: 'modal__body'},
            _.if(state.name === 'error', 
                state.message,
            ),

            _.if(state.name === undefined,
                _.input({type: 'text', class: 'widget widget--input text modal--pick-icon__search', placeholder: 'Search for icons', oninput: (e) => _.onSearch(e.target.value)}),
                _.div({class: 'modal--pick-icon__icons'},
                    _.each(state.icons, (i, icon) => 
                        _.button({class: 'modal--pick-icon__icon widget widget--button fa fa-' + icon, title: icon, onclick: () => _.onClickIcon(icon)})
                    )
                )
            )
        ),
        _.if(state.name === 'error', 
            _.div({class: 'modal__footer'},
                _.button({class: 'widget widget--button', onclick: _.onClickReset}, 'OK')
            )
        )
    )
)
