'use strict';

module.exports = (_, model, state) =>

_.div({class: `widget widget--media ${model.class || ''}`},
    _.button({class: 'widget--media__preview', title: 'Pick media item', onclick: _.onClickBrowse},
        _[state.tagName]({src: state.source, class: `widget--media__preview__source ${!state.source ? 'fa fa-plus' : ''}`})        
    ),
    _.if(!model.readonly,
        _.div({class: 'widget--media__tools'},
            _.label({class: 'widget--media__name'}, state.title),
            _.button({class: 'widget--media__clear fa fa-remove', title: 'Clear selection', onclick: _.onClickClear})
        )
    )
)
