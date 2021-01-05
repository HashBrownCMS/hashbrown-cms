'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal in'},
    _.div({class: 'modal__dialog'},
        _.div({class: 'modal__header'},
            _.h4({class: 'modal__title', localized: true}, 'Backups'),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({class: 'modal__body', localized: true},
            state.name === 'error' ? [
                state.message
            
            ] : state.name === 'uploading' ? [
                _.file({name: 'backup', onsubmit: _.onSubmitBackup})
            
            ] : state.name === 'restoring' ? [
                'Are you sure you want to restore this backup? Current resources will be replaced.'
            
            ] : state.name === 'deleting' ? [
                'Are you sure you want to delete this backup?'
            
            ] : [
                !model.backups || model.backups.length < 1 ? [
                    _.label({localized: true, class: 'widget widget--label'}, 'No backups yet')
                ] : null,
                _.each(model.backups, (i, timestamp) =>
                    _.div({class: 'widget-group'},
                        _.label({class: 'widget widget--label'},
                            isNaN(new Date(parseInt(timestamp))) ? [
                                timestamp
                            ] : [
                                new Date(parseInt(timestamp)).toString()
                            ]
                        ),
                        _.popup({
                            icon: 'ellipsis-v',
                            color: 'default',
                            role: 'item-menu',
                            localized: true,
                            options: {
                                'Restore': () => { _.onClickRestoreBackup(timestamp); },
                                'Download': () => { _.onClickDownloadBackup(timestamp); },
                                'Delete': () => { _.onClickDeleteBackup(timestamp); }
                            }
                        })
                    )
                )
            ]
        ),
        _.div({class: 'modal__footer', localized: true},
            state.name === 'error' ? [
                _.button({localized: true, class: 'widget widget--button', title: 'OK', onclick: _.onClickReset}, 'OK')
            
            ] : state.name === 'uploading' ? [
                _.button({localized: true, class: 'widget widget--button', title: 'Cancel', onclick: _.onClickReset}, 'Cancel'),
            
            ] : state.name === 'restoring' ? [
                _.button({localized: true, class: 'widget widget--button', title: 'Cancel', onclick: _.onClickReset}, 'Cancel'),
                _.button({localized: true, class: 'widget widget--button', title: 'Restore', onclick: _.onClickConfirmRestoreBackup}, 'Restore')
            
            ] : state.name === 'deleting' ? [
                _.button({localized: true, class: 'widget widget--button', title: 'Cancel', onclick: _.onClickReset}, 'Cancel'),
                _.button({localized: true, class: 'widget widget--button', title: 'Delete', onclick: _.onClickConfirmDeleteBackup}, 'Delete')
            
            ] : [
                _.button({localized: true, class: 'widget widget--button', title: 'Upload backup', onclick: _.onClickUploadBackup}, 'Upload'),
                _.button({localized: true, class: 'widget widget--button', title: 'Create a new backup', onclick: _.onClickCreateBackup}, 'New')
            
            ]
        )
    )
)
