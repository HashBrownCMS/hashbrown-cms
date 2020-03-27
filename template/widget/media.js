'use strict';

module.exports = (_, model, state) =>

_.div({class: `widget widget--media ${model.class || ''}`},
    _.div({class: 'widget--media__display'}, 
        state.name === 'error' ? [
            _.div({class: 'widget--media__preview fa fa-exclamation-triangle'}) 

        ] : model.readonly || model.disabled ? [
            _.div({class: 'widget--media__preview readonly' + (model.full ? ' full' : ''), title: state.title},
                _[state.tagName]({src: state.source, controls: !model.disabled && state.tagName === 'video', class: `widget--media__preview__source ${state.tagName === 'div' ? 'fa fa-file' : ''}`})
            )

        ] : [
            _.button({class: 'widget--media__preview' + (model.full ? ' full' : ''), title: state.message || 'Pick media item', onclick: _.onClickBrowse},
                _[state.tagName]({src: state.source, class: `widget--media__preview__source ${!state.source ? 'fa fa-plus' : ''}`})        
            )

        ]
    ),
    _.div({class: 'widget--media__tools'},
        _.label({class: 'widget--media__name', title: state.message || state.title}, state.message || state.title),

        !model.readonly && !model.disabled ? [
            _.button({class: 'widget--media__clear fa fa-remove', title: 'Clear selection', onclick: _.onClickClear})
        ] : null
    )
)
