'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal in'},
    _.div({class: 'modal__dialog'},
        _.div({class: 'modal__header'},
            _.h4({class: 'modal__title'}, 'Migrate'),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({class: 'modal__body'},
            state.name === 'error' ? [
                state.message
            
            ] : [
                _.field({label: 'Items to migrate'},
                    _.popup({value: state.resources, options: state.resourceOptions, multiple: true, onchange: _.onChangeResources})
                ),
                state.dependencies && Object.keys(state.dependencies).length > 0 ? [
                    _.field({label: 'Dependencies'},
                        _.each(state.dependencies, (category, items) => {
                            return [
                                _.h4(category),
                                _.ul(
                                    _.each(items, (i, item) => {
                                        if(!item) { return; }

                                        return _.li(item.getName());
                                    })
                                )
                            ];
                        })
                    )
                ] : null
            ]
        ),
        _.div({class: 'modal__footer'},
            state.name === 'error' ? [
                _.button({class: 'widget widget--button', onclick: _.onClickReset}, 'OK')
            
            ] : [
                _.button({class: 'widget widget--button', onclick: _.onClickMigrate}, 'Migrate')
            
            ]
        )
    )
)
