'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal in'},
    _.div({class: 'modal__dialog'},
        _.div({class: 'modal__header'},
            _.h4({class: 'modal__title'}, `Migrate content of ${model.settings.info.name}`),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({class: 'modal__body'},
            _.if(state.name === 'error', 
                state.message
            ),

            _.if(state.name === 'success',
                `Successfully migrated resources from ${state.from} to ${state.to}`
            ),

            _.if(state.name === undefined,
                _.div({class: 'widget-group'},
                    _.popup({value: state.from, options: model.environments, onchange: _.onChangeFromOption}),
                    _.div({class: 'widget-group__separator fa fa-arrow-right'}),
                    _.popup({value: state.to, options: model.environments.filter((environment) => environment !== state.from), onchange: _.onChangeToOption})
                ),
                _.each(state.resourceOptions, (key, label) =>
                    _.div({class: 'widget-group'},      
                        _.label({class: 'widget widget--label'}, label),
                        _.switch({name: key, value: state.settings[key] === true, onchange: (value) => _.onChangeResourceOption(key, value)})
                    )
                )
            )
        ),
        _.div({class: 'modal__footer'},
            _.if(state.name === 'error', 
                _.button({class: 'widget widget--button', onclick: _.onClickReset}, 'OK')
            ),
            
            _.if(state.name === 'success', 
                _.button({class: 'widget widget--button', onclick: _.onClickClose}, 'OK')
            ),
            
            _.if(state.name === undefined, 
                _.button({class: 'widget widget--button', onclick: _.onClickMigrate}, 'Migrate')
            )
        )
    )
)
