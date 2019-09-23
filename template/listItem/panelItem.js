'use strict';

module.exports = (_, model, state) =>
        
_.div({class: `list-item--panel-item ${model.type || ''} ${state.isActive ? 'active' : ''}`, 'data-sort': model.sort, id: model.id},
    _.div({class: 'list-item--panel-item__inner', name:'inner', draggable: model.isDraggable, ondragstart: _.onDragStart, ondragend: _.onDragEnd,  ondragover: _.onDragOver, ondragleave: _.onDragLeave, ondrop: _.onDrop},
        _[model.isDisabled ? 'div' : 'a']({href: model.isDisabled ? null : `#/${model.category}/${model.id}`, class: 'list-item--panel-item__name', oncontextmenu: _.onClickContext},
            _.if(model.icon,
                _.span({class: `list-item--panel-item__icon fa fa-${model.icon}`})
            ),
            model.name       
        ), 
        _.div({class: 'list-item--panel-item__properties'},
            _.if(model.isRemote,
                _.div({class: 'list-item--panel-item__property fa fa-external-link'})
            ),
            _.if(model.isLocked,
                _.div({class: 'list-item--panel-item__property fa fa-lock'})
            )
        ),
        _.div({class: 'list-item--panel-item__actions'},
            _.if(model.children.length > 0,
                _.button({class: `list-item--panel-item__action fa fa-${state.isExpanded ? 'caret-down' : 'caret-right'}`, onclick: _.onClickExpand})
            ),
            _.if(!model.isDisabled && model.options && model.options.length > 0,
                _.button({class: 'list-item--panel-item__action fa fa-ellipsis-v', onclick: _.onClickContext})
            )
        )
    ),
    _.if(state.isExpanded && model.children.length > 0,
        _.div({class: 'list-item--panel-item__children'},
            model.children
        )
    )
)
