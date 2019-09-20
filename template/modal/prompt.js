'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal in'},
    _.div({class: 'modal__dialog'},
        _.div({class: 'modal__header'},
            _.h4({class: 'modal__title'}, model.heading)
        ),
        _.div({class: 'modal__body'},
            _.div({class: 'widget-group'},
                _.label({class: 'widget widget--label'}, model.message),
                _[model.widget]({placeholder: model.placeholder, value: model.value, onchange: _.onChange})
            )
        ),
        _.div({class: 'modal__footer'},
            _.button({class: 'widget widget--button', onclick: _.onClickOK}, 'OK')
        )
    )
)
