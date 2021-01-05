'use strict';

module.exports = (_, model, state) => 

_.div({localized: true, class: `widget widget--folders ${model.class || ''}`},
    state.name === 'error' ? [
        state.message,
   
    ] : state.name === 'adding' ? [
        _.div({class: 'widget-group'},
            _.label({class: 'widget widget--label'}, state.addToPath),
            _.text({localized: true, name: 'adding', value: 'New folder'}),
            _.button({class: 'widget widget--button small fa fa-check', onclick: _.onClickConfirmAdd})
        )
    
    ] : [
        _.recurse([ state.root ], 'children', (i, folder, children) =>
            _.div({class: `widget--folders__folder ${model.value === folder.path ? 'active' : ''}`, 'data-path': folder.path},
                _.div({class: 'widget--folders__folder__inner'},
                    _.button({class: 'widget--folders__folder__name', onclick: (e) => _.onClick(folder.path)},
                        _.span({class: 'widget--folders__folder__icon fa fa-folder'}),
                        folder.name
                    ),
                    model.add ? [
                        _.button({localized: true, class: 'widget--folders__folder__add fa fa-plus', title: `Add folder inside "${folder.name}"`, onclick: () => _.onClickAdd(folder.path)})
                    ] : null
                ),
                _.div({class: 'widget widget--folders__folder__children'},
                    children
                )
            )
        )
    ]
)
