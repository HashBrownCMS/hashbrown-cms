'use strict';

const RequestHelper = require('Client/Helpers/RequestHelper');

/**
 * The project backup editor
 *
 * @memberof HashBrown.Client.Views.Dashboard
 */
class BackupEditor extends HashBrown.Views.Modals.Modal {
    constructor(params) {
        params.model = params.model || {};
        params.model.settings = params.model.settings || {};
        params.model.settings.info = params.model.settings.info || {};
        params.model.settings.info.name = params.model.settings.info.name || params.model.id;

        params.title = params.model.settings.info.name + ' backups';
        params.body = _.div(
            // List existing backups
            _.each(params.model.backups, (i, backup) => {
                let label = backup;
                let date = new Date(parseInt(backup));

                if(!isNaN(date.getTime())) {
                    label = date.toString();
                }

                return _.div({class: 'page--dashboard__backup-editor__backup widget-group'},
                    _.p({class: 'widget widget--label page--dashboard__backup-editor__back__label'}, label),
                    new HashBrown.Views.Widgets.Dropdown({
                        icon: 'ellipsis-v',
                        reverseKeys: true,
                        options: {
                            'Restore': () => { this.onClickRestoreBackup(backup); },
                            'Download': () => { location = RequestHelper.environmentUrl('server/backups/' + this.model.id + '/' + backup + '.hba') },
                            'Delete': () => { this.onClickDeleteBackup(backup); }
                        }
                    }).$element
                );
            })
        );

        super(params);

        this.fetch();
    }
    
    /**
     * Event: Click upload button
     */
    onClickUploadBackup() {
        let view = this;

        function onChangeFile() {
            let input = $(this);
            let numFiles = this.files ? this.files.length : 1;
            
            if(numFiles > 0) {
                let file = this.files[0];
                
                debug.log('Reading data of file type ' + file.type + '...', view);
            }
        }
        
        function onClickUpload() {
            uploadModal.$element.find('form').submit();

            return false;
        }

        function onSubmit(e) {
            e.preventDefault();

            let apiPath = 'server/backups/' + view.model.id + '/upload';

            // TODO: Use the RequestHelper for this
            $.ajax({
                url: RequestHelper.environmentUrl(apiPath),
                type: 'POST',
                data: new FormData(this),
                processData: false,
                contentType: false,
                success: function(id) {
                    new MessageModal({
                        model: {
                            title: 'Success',
                            body: 'Backup uploaded successfully',
                            onSubmit: () => {
                                this.fetch();

                                uploadModal.close();
                            }
                        }
                    });
                }
            });
        }

        let uploadModal = new HashBrown.Views.Modals.Modal({
            title: 'Upload a backup file',
            body: _.form(
                _.input({class: 'widget widget--input', type: 'file', name: 'backup'})
                    .change(onChangeFile)
            ).submit(onSubmit),
            actions: [
                {
                    label: 'Cancel',
                    class: 'default'
                },
                {
                    label: 'OK',
                    callback: onClickUpload
                }
            ]
        });
    }

    /**
     * Event: Click backup button
     */
    onClickCreateBackup() {
        if(!currentUserIsAdmin()) { return; }

        RequestHelper.request('post', 'server/backups/' + this.model.id + '/new')
        .then((data) => {
            UI.messageModal('Success', 'Project "' + this.model.id + '" was backed up successfully');
            
            this.fetch();
        })
        .catch(UI.errorModal);
    }

    /**
     * Event: Click restore backup button
     *
     * @param {String} timestamp
     */
    onClickRestoreBackup(timestamp) {
        if(!currentUserIsAdmin()) { return; }
            
        let label = '"' + timestamp + '"';
        let date = new Date(parseInt(timestamp));

        if(!isNaN(date.getTime())) {
            label = date.toString();
        }
                            
        let modal = UI.confirmModal('restore', 'Restore backup', 'Are you sure you want to restore the backup ' + label + '? Current content will be replaced.', () => {
            RequestHelper.request('post', 'server/backups/' + this.model.id + '/' + timestamp + '/restore')
            .then(() => {
                UI.messageModal('Success', 'Project "' + this.model.id + '" was restored successfully to ' + label, () => {
                    modal.close();

                    this.fetch();
                });
            })
            .catch(UI.errorModal);
        });
    }
    
    /**
     * Event: Click delete backup button
     */ 
    onClickDeleteBackup(timestamp) {
        if(!currentUserIsAdmin()) { return; }
        
        let label = timestamp;
        let date = new Date(parseInt(timestamp));

        if(!isNaN(date.getTime())) {
            label = date.toString();
        }
        
        let modal = UI.confirmModal('delete', 'Delete backup', 'Are you sure you want to delete the backup "' + label + '"?', () => {
            RequestHelper.request('delete', 'server/backups/' + this.model.id + '/' + timestamp)
            .then(() => {
                this.fetch();
            })
            .catch(UI.errorModal);
        });
    }

    /**
     * Renders the modal footer
     *
     * @returns {HTMLElement} Footer
     */
    renderFooter() {
        return [    
            _.button({class: 'widget widget--button', title: 'Upload backup'}, 'Upload')
                .click(() => { this.onClickUploadBackup(); }),
            _.button({class: 'widget widget--button', title: 'Create a new backup'}, 'Create')
                .click(() => { this.onClickCreateBackup(); })
        ];
    }
}

module.exports = BackupEditor;
