'use strict';

class BackupEditor extends View {
    constructor(params) {
        super(params);

        this.modal = new MessageModal({
            model: {
                class: 'modal-project-admin',
                title: this.model.id + ' backups',
                body: _.div(
					// List existing backups
					_.h4('Backups'),
					_.each(this.model.backups, (i, backup) => {
						let label = backup;
						let date = new Date(parseInt(backup));

						if(!isNaN(date.getTime())) {
							label = date.toString();
						}

						return _.div({class: 'project-backup'},
							_.p({class: 'project-backup-name'}, label),
							_.div({class: 'dropdown'},
								_.button({class: 'dropdown-toggle', 'data-toggle': 'dropdown'},
									_.span({class: 'fa fa-ellipsis-v'})
								),
								_.ul({class: 'dropdown-menu'},
									_.li(
										// Restore backup
										_.a({href: '#', class: 'dropdown-item'}, 'Restore')
											.click((e) => { e.preventDefault(); this.onClickRestoreBackup(backup); })
									),
									_.li(
										// Download backup
										_.a({class: 'dropdown-item', href: apiUrl('server/backups/' + this.model.id + '/' + backup + '.hba')},
											'Download'
										)
									),
									_.li(
										// Delete backup
										_.a({href: '#', class: 'dropdown-item'},
											'Delete'
										).click((e) => { e.preventDefault(); this.onClickDeleteBackup(backup); })
									)
								)
							)
						);
					}),
                    
                    // Create backup
                    _.div({class: 'btn-round-group'},
                        _.button({class: 'btn btn-round btn-raised btn-default btn-group-addon btn-upload-backup'},
                            _.span({class: 'fa fa-upload'}),
                            _.label('Upload')
                        ).click(() => { this.onClickUploadBackup(); }),
                        _.button({class: 'btn btn-round btn-raised btn-primary btn-create-backup'},
                            _.span({class: 'btn-icon-initial'}, _.span({class: 'fa fa-plus'})),
                            _.span({class: 'btn-icon-display fa fa-save'}),
                            _.label('Create')
                        ).click(() => { this.onClickCreateBackup(); })
                    )
                )
            }
        });

        this.$element = this.modal.$element; 

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
                
                console.log(file);

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

            $.ajax({
                url: apiUrl(apiPath),
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
                                location.reload();
                            }
                        }
                    });
                }
            });
        }

        let uploadModal = new MessageModal({
            model: {
                title: 'Upload a backup file',
                body: _.form(
                    _.input({class: 'form-control', type: 'file', name: 'backup'})
                        .change(onChangeFile)
                ).submit(onSubmit)
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default'
                },
                {
                    label: 'OK',
                    class: 'btn-primary',
                    callback: onClickUpload
                }
            ]
        });
    }

    /**
     * Event: Click backup button
     */
    onClickCreateBackup() {
        if(!User.current.isAdmin) { return; }

        apiCall('post', 'server/backups/' + this.model.id + '/new')
        .then((data) => {
            new MessageModal({
                model: {
                    title: 'Success',
                    body: 'Project "' + this.model.id + '" was backed up successfully'
                },
                buttons: [
                    {
                        callback: () => { location.reload(); },
                        label: 'OK',
                        class: 'btn-primary'
                    }
                ]
            });
        })
        .catch(UI.errorModal);
    }

    /**
     * Event: Click restore backup button
     *
     * @param {String} timestamp
     */
    onClickRestoreBackup(timestamp) {
        if(!User.current.isAdmin) { return; }
            
        let label = '"' + timestamp + '"';
        let date = new Date(parseInt(timestamp));

        if(!isNaN(date.getTime())) {
            label = date.toString();
        }
                            
        let modal = new MessageModal({
            model: {
                title: 'Restore backup',
                body: 'Are you sure you want to restore the backup ' + label + '? Current content will be replaced.'
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default'
                },
                {
                    label: 'Restore',
                    class: 'btn-danger',
                    callback: () => {
                        apiCall('post', 'server/backups/' + this.model.id + '/' + timestamp + '/restore')
                        .then(() => {
                            new MessageModal({
                                model: {
                                    title: 'Success',
                                    body: 'Project "' + this.model.id + '" was restored successfully to ' + label
                                },
                                buttons: [
                                    {
                                        callback: () => { location.reload(); },
                                        label: 'OK',
                                        class: 'btn-primary'
                                    }
                                ]
                            });
                        })
                        .catch(UI.errorModal);
                    }
                }
            ]
        });
    }
    
    /**
     * Event: Click delete backup button
     */ 
    onClickDeleteBackup(timestamp) {
        if(!User.current.isAdmin) { return; }
        
        let label = timestamp;
        let date = new Date(parseInt(timestamp));

        if(!isNaN(date.getTime())) {
            label = date.toString();
        }
        
        let modal = new MessageModal({
            model: {
                title: 'Delete backup',
                body: 'Are you sure you want to delete the backup "' + label + '"?'
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default'
                },
                {
                    label: 'Delete',
                    class: 'btn-danger',
                    callback: () => {
                        apiCall('delete', 'server/backups/' + this.model.id + '/' + timestamp)
                        .then(() => {
                            location.reload();
                        })
                        .catch(UI.errorModal);
                    }
                }
            ]
        });
    }
}

module.exports = BackupEditor;
