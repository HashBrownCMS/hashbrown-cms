'use strict';

module.exports = (_, model, state) => 

_.div({class: `widget widget--folders ${model.class || ''}`},
    _.if(state.name === 'error', 
        state.message,
    ),
    
    _.if(state.name === 'adding',
        _.div({class: 'widget-group'},
            _.label({class: 'widget widget--label'}, state.addToPath),
            _.text({name: 'adding', value: 'New folder'}),
            _.button({class: 'widget widget--button small fa fa-check', onclick: _.onClickConfirmAdd})
        )
    ),
    
    _.if(state.name === undefined,
        _.recurse([ state.root ], 'children', (i, folder, children) =>
            _.div({class: `widget--folders__folder ${model.value === folder.path ? 'active' : ''}`, 'data-path': folder.path},
                _.div({class: 'widget--folders__folder__inner'},
                    _.button({class: 'widget--folders__folder__name', onclick: (e) => _.onClick(folder.path)},
                        _.span({class: 'widget--folders__folder__icon fa fa-folder'}),
                        folder.name
                    ),
                    _.if(model.add,
                        _.button({class: 'widget--folders__folder__add fa fa-plus', title: `Add folder inside "${folder.name}"`, onclick: () => _.onClickAdd(folder.path)})
                    )
                ),
                _.div({class: 'widget widget--folders__folder__children'},
                    children
                )
            )
        )
    )
)
