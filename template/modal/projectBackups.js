'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal in'},
    _.div({class: 'modal__dialog'},
        _.div({class: 'modal__header'},
            _.h4({class: 'modal__title'}, `Backups for ${model.settings.info.name}`),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({class: 'modal__body'},
            _.if(state.name === 'error', 
                state.message
            ),

            _.if(state.name === 'uploading',
                _.input({type: 'file', name: 'backup', onsubmit: _.onSubmitBackup})
            ),
            
            _.if(state.name === 'restoring',
                `Are you sure you want to restore the backup ${state.backupName}? Current content will be replaced.`
            ),
            
            _.if(state.name === 'deleting',
                `Are you sure you want to delete the backup ${state.backupName}?`
            ),
            
            _.if(state.name === undefined,
                _.if(!model.backups || model.backups.length < 1,
                    _.label({class: 'widget widget--label'}, 'No backups yet')
                ),
                _.each(model.backups, (i, timestamp) =>
                    _.div({class: 'widget-group'},
                        _.label({class: 'widget widget--label'},
                            isNaN(new Date(parseInt(timestamp))) ?
                                timestamp
                            :
                                new Date(parseInt(timestamp)).toString()
                        ),
                        _.popup({
                            icon: 'ellipsis-v',
                            role: 'item-menu',
                            options: {
                                'Restore': () => { _.onClickRestoreBackup(timestamp); },
                                'Download': () => { _.onClickDownloadBackup(timestamp); },
                                'Delete': () => { _.onClickDeleteBackup(timestamp); }
                            }
                        })
                    )
                )
            )
        ),
        _.div({class: 'modal__footer'},
            _.if(state.name === 'error',
                _.button({class: 'widget widget--button', title: 'OK', onclick: _.onClickReset}, 'OK')
            ),

            _.if(state.name === 'uploading',
                _.button({class: 'widget widget--button', title: 'Cancel', onclick: _.onClickReset}, 'Cancel'),
            ),
            
            _.if(state.name === 'restoring',
                _.button({class: 'widget widget--button', title: 'Cancel', onclick: _.onClickReset}, 'Cancel'),
                _.button({class: 'widget widget--button', title: 'Restore', onclick: _.onClickConfirmRestoreBackup}, 'Restore')
            ),

            _.if(state.name === 'deleting',
                _.button({class: 'widget widget--button', title: 'Cancel', onclick: _.onClickReset}, 'Cancel'),
                _.button({class: 'widget widget--button', title: 'Delete', onclick: _.onClickConfirmDeleteBackup}, 'Delete')
            ),
            
            _.if(state.name === undefined,
                _.button({class: 'widget widget--button', title: 'Upload backup', onclick: _.onClickUploadBackup}, 'Upload'),
                _.button({class: 'widget widget--button', title: 'Create a new backup', onclick: _.onClickCreateBackup}, 'Create')
            )
        )
    )
)
