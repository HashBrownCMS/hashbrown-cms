'use strict';

module.exports = (_, model, state) =>
        
_.div({class: `list-item--panel-item ${model.type || ''} ${state.isActive ? 'active' : ''}`, id: model.id},
    _.div({class: 'list-item--panel-item__inner'},
        _.a({href: `#/${model.category}/${model.id}`, class: 'list-item--panel-item__name', oncontextmenu: _.onClickContext},
            model.name       
        ), 
        _.div({class: 'list-item--panel-item__icons'},
            _.if(model.isRemote,
                _.div({class: 'list-item--panel-item__icon fa fa-external-link'})
            )
        ),
        _.div({class: 'list-item--panel-item__actions'},
            _.if(model.children.length > 0,
                _.button({class: `list-item--panel-item__action fa fa-${state.isExpanded ? 'caret-down' : 'caret-right'}`, onclick: _.onClickExpand})
            ),
            _.button({class: 'list-item--panel-item__action fa fa-ellipsis-v', onclick: _.onClickContext})
        )
    ),
    _.if(state.isExpanded && model.children.length > 0,
        _.div({class: 'list-item--panel-item__children'},
            model.children
        )
    )
)
