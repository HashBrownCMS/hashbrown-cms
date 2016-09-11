'use strict';

/**
 * The editor for projects as seen on the dashboard
 */
class ProjectEditor extends View {
    constructor(params) {
        super(params);

        this.init();
    }
   
    /**
     * Checks whether the current user is admin
     *
     * @returns {Boolean} Is the current user admin
     */
    isAdmin() {
        for(let i in this.model.users) {
            let user = this.model.users[i];

            if(user.isCurrent && user.isAdmin) {
                return true;
            }
        }

        return false;
    }

    /**
     * Event: Click remove button
     */ 
    onClickRemove() {
        let view = this;

        if(this.isAdmin()) {
            let modal = new MessageModal({
                model: {
                    title: 'Delete project',
                    body: _.div({},
                        _.p('Please type in the project name to confirm'),
                        _.input({class: 'form-control', type: 'text', placeholder: 'Project name'})
                            .on('change propertychange input keyup paste', function() {
                                let $btn = modal.$element.find('.btn-danger');
                                let isMatch = $(this).val() == view.model.name;
                                
                                $btn.attr('disabled', !isMatch);
                                $btn.toggleClass('disabled', !isMatch);
                            })
                    )
                },
                buttons: [
                    {
                        label: 'Cancel',
                        class: 'btn-default'
                    },
                    {
                        label: 'Delete',
                        class: 'btn-danger disabled',
                        disabled: true,
                        callback: () => {
                            apiCall('delete', 'server/projects/' + this.model.name)
                            .then(() => {
                                location.reload();
                            })
                            .catch(errorModal);
                        }
                    }
                ]
            });
        }
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

            let apiPath = 'server/backups/' + view.model.name + '/upload';

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
        if(this.isAdmin()) {
            apiCall('post', 'server/backups/' + this.model.name + '/new')
            .then((data) => {
                new MessageModal({
                    model: {
                        title: 'Success',
                        body: 'Project "' + this.model.name + '" was backed up successfully'
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
            .catch(errorModal);
        }
    }

    /**
     * Event: Click restore backup button
     *
     * @param {String} timestamp
     */
    onClickRestoreBackup(timestamp) {
        if(this.isAdmin()) {
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
                            apiCall('post', 'server/backups/' + this.model.name + '/' + timestamp + '/restore')
                            .then(() => {
                                new MessageModal({
                                    model: {
                                        title: 'Success',
                                        body: 'Project "' + this.model.name + '" was restored successfully to ' + label
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
                            .catch(errorModal);
                        }
                    }
                ]
            });
        }
    }
    
    /**
     * Event: Click delete backup button
     */ 
    onClickDeleteBackup(timestamp) {
        if(this.isAdmin()) {
            let label = backup;
            let date = new Date(parseInt(backup));

            if(!isNaN(date.getTime())) {
                label = date.toString();
            }
            
            let modal = new MessageModal({
                model: {
                    title: 'Delete backup',
                    body: 'Are you sure you want to delete the backup ' + label + '?'
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
                            apiCall('delete', 'server/backups/' + this.model.name + '/' + timestamp)
                            .then(() => {
                                location.reload();
                            })
                            .catch(errorModal);
                        }
                    }
                ]
            });
        }
    }

    /**
     * Event: Click backups button
     */
    onClickBackups() {
        if(this.isAdmin()) {
            new MessageModal({
                model: {
                    class: 'modal-project-admin',
                    title: this.model.name + ' backups',
                    body: _.div({},
                        // List existing backups
                        _.if(this.model.backups.length > 0,
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
                                                _.a({class: 'dropdown-item', href: apiUrl('server/backups/' + this.model.name + '/' + backup + '.hba')},
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
                            })
                        ),

                        // Empty message
                        _.if(this.model.backups.length < 1,
                            _.p('No backups here')
                        ),
                        
                        // Create backup
                        _.div({class: 'btn-round-group'},
                            _.button({class: 'btn btn-round btn-raised btn-default btn-group-addon btn-upload-backup'},
                                _.span({class: 'fa fa-upload'}),
                                _.label('Upload')
                            ).click(() => { this.onClickUploadBackup(); }),
                            _.button({class: 'btn btn-round btn-raised btn-primary btn-create-backup'},
                                _.span({class: 'btn-icon-initial'}, '+'),
                                _.span({class: 'btn-icon-display fa fa-save'}),
                                _.label('Create')
                            ).click(() => { this.onClickCreateBackup(); })
                        )
                    )
                }
            }); 
        }
    }

    /**
     * Event: Click migration button
     */
    onClickMigrate() {
        let modal = new MessageModal({
            model: {
                class: 'modal-migrate-content',
                title: 'Migrate content',
                body: _.div({},
                    _.select({class: 'form-control'},
                        _.each(this.model.settings.environments.names, (i, environment) => {
                            return _.option({value: environment}, environment);  
                        })
                    )
                )
            }
        });
    }

    /**
     * Event: Click add environment button
     */
    onClickAddEnvironment() {
        let modal = new MessageModal({
            model: {
                title: 'New environment for "' + this.model.name + '"',
                body: _.input({class: 'form-control', type: 'text', placeholder: 'Type environment name here'})
            },
            buttons: [
                {
                    label: 'Create',
                    class: 'btn-primary',
                    callback: () => {
                        let newName = modal.$element.find('input').val();

                        this.model.settings.environments.names.push(newName);

                        apiCall('post', 'server/settings/' + this.model.name + '/environments', this.model.settings.environments)
                        .then(() => {
                            messageModal('Succes', 'The new environment "' + newName + '" was created successfully', () => { location.reload(); });
                        })
                        .catch(errorModal);

                        return false;
                    }
                }
            ]
        });
    }

    render() {
        let languageCount = this.model.settings.language.selected.length;
        let userCount = this.model.users.length;

        this.$element = _.div({class: 'raised project-editor'},
            _.div({class: 'body'},
                _.if(this.isAdmin(),
                    _.div({class: 'admin dropdown'}, 
                        _.button({class: 'dropdown-toggle', 'data-toggle': 'dropdown'},
                            _.span({class: 'fa fa-ellipsis-v'})
                        ),
                        _.ul({class: 'dropdown-menu'},
                            _.li(
                                _.a({href: '#', class: 'dropdown-item'}, 
                                    'Backups'
                                ).click((e) => { e.preventDefault(); this.onClickBackups(); })
                            ),
                            _.if(this.model.settings.environments.names.length > 1,
                                _.li(
                                    _.a({href: '#', class: 'dropdown-item'}, 
                                        'Migrate content'
                                    ).click((e) => { e.preventDefault(); this.onClickMigrate(); })
                                )
                            ),
                            _.li(
                                _.a({href: '#', class: 'dropdown-item'},
                                    'Delete'
                                ).click((e) => { e.preventDefault(); this.onClickRemove(); })
                            )
                        )
                    )
                ),
                _.div({class: 'info'},
                    _.h2(this.model.name),
                    _.p(userCount + ' user' + (userCount != 1 ? 's' : '')),
                    _.p(languageCount + ' language' + (languageCount != 1 ? 's' : '') + ' (' + this.model.settings.language.selected.join(', ') + ')')
                ),
                _.div({class: 'environments'},
                    _.h4('Environments'),
                    _.each(this.model.settings.environments.names, (i, environment) => {
                        return _.div({class: 'environment'},
                            _.div({class: 'btn-group'},
                                _.span({class: 'environment-title'}, environment),
                                _.a({href: '/' + this.model.name + '/' + environment, class: 'btn btn-primary environment'}, 'cms'),
                                _.if(this.isAdmin(),
                                    _.div({class: 'dropdown'},
                                        _.button({class: 'dropdown-toggle', 'data-toggle': 'dropdown'},
                                            _.span({class: 'fa fa-ellipsis-v'})
                                        ),
                                        _.ul({class: 'dropdown-menu'},
                                            _.li(
                                                _.a({href: '#', class: 'dropdown-item'},
                                                    'Delete'
                                                ).click((e) => { e.preventDefault(); this.onClickRemoveEnvironment(); })
                                            )
                                        )
                                    )
                                )
                            )
                        );
                    }),
                    _.button({class: 'btn btn-primary btn-add btn-raised btn-round'}, '+')
                        .click(() => { this.onClickAddEnvironment(); })
                )
            )
        );
    }
}

module.exports = ProjectEditor;
