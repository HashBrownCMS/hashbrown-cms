'use strict';

module.exports = (_, model, state) =>
        
_.div({class: `list-item--panel-item ${model.type || ''} ${state.isActive ? 'active' : ''}`, 'data-sort': model.sort, id: model.id},
    _.div({class: 'list-item--panel-item__inner', name: 'inner', draggable: model.isDraggable, ondragstart: _.onDragStart, ondragend: _.onDragEnd,  ondragover: _.onDragOver, ondragleave: _.onDragLeave, ondrop: _.onDrop},
        _[model.isDisabled ? 'div' : 'a']({href: model.isDisabled ? null : `#/${model.library}/${model.id}`, class: 'list-item--panel-item__name', oncontextmenu: _.onClickContext},
            model.icon && !model.image ? [
                _.span({class: `list-item--panel-item__icon fa fa-${model.icon}`})
            ] : null,

            model.name       
        ), 
        _.div({class: 'list-item--panel-item__properties'},
            model.isRemote ? [
                _.div({class: 'list-item--panel-item__property fa fa-external-link', title: 'This resource is on a remote server'})
            ] : null,

            model.isLocked ? [
                _.div({class: 'list-item--panel-item__property fa fa-lock', title: 'This resource is locked'})
            ] : null,

            model.message ? [
                _.div({class: 'list-item--panel-item__property fa fa-exclamation-triangle', title: model.message})
            ] : null
        ),
        _.div({class: 'list-item--panel-item__actions'},
            model.children.length > 0 ? [
                _.button({class: `list-item--panel-item__action fa fa-${state.isExpanded ? 'caret-down' : 'caret-right'}`, onclick: _.onClickExpand})
            ] : null,

            !model.isDisabled && model.options && Object.keys(model.options).length > 0 ? [
                _.button({class: 'list-item--panel-item__action fa fa-ellipsis-v', onclick: _.onClickContext})
            ] : null
        )
    ),
    state.isExpanded && model.children.length > 0 ? [
        _.div({class: 'list-item--panel-item__children'},
            model.children
        )
    ] : null
)
