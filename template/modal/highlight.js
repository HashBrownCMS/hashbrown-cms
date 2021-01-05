'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal--highlight' + (model.label ? ' ' + model.direction : ''), style: 'top: ' + model.element.offsetTop + 'px; left: ' + model.element.offsetLeft + 'px;', onclick: _.onClickHighlight},
    _.div({class: 'modal--highlight__backdrop'}),
    _.div({class: 'modal--highlight__frame', style: 'width: ' + model.element.offsetWidth + 'px; height: ' + model.element.offsetHeight + 'px;'}),
    model.label ? [
        _.div({class: 'modal--highlight__label'},
            _.div({localized: true, class: 'modal--highlight__label__text'}, model.label),
            model.buttonLabel ? _.button({localized: true, class: 'widget widget--button modal--highlight__button condensed', onclick: _.onClickDismiss}, model.buttonLabel) : null
        )
    ] : null
)
