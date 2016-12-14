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
                                let isMatch = $(this).val() == view.model.settings.info.name;
                                
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
                            apiCall('delete', 'server/projects/' + this.model.id)
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

    /**
     * Event: Click remove environment
     *
     * @param {String} environmentName
     */
    onClickRemoveEnvironment(environmentName) {
        let modal = UI.confirmModal('Remove', 'Remove environment "' + environmentName + '"', 'Are you sure want to remove the environment "' + environmentName + '" from the project "' + (this.model.title || this.model.id) + '"?', () => {
            apiCall('delete', 'server/projects/' + this.model.id + '/' + environmentName)
            .then(() => {
                location.reload();
            })
            .catch(UI.errorModal);
        });
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
        if(this.isAdmin()) {
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
    }
    
    /**
     * Event: Click delete backup button
     */ 
    onClickDeleteBackup(timestamp) {
        if(this.isAdmin()) {
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

    /**
     * Event: Click backups button
     */
    onClickBackups() {
        if(this.isAdmin()) {
            new MessageModal({
                model: {
                    class: 'modal-project-admin',
                    title: this.model.id + ' backups',
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
        let updateOptions = () => {
            _.append(modal.$element.find('.environment-to').empty(),
                _.each(this.model.settings.environments.names, (i, environment) => {
                    // Filter out "from" environment
                    if(environment != modal.$element.find('.environment-from').val()) {
                        return _.option({value: environment}, environment);  
                    }
                })
            );
        };

        let onSubmit = () => {
            data.from = modal.$element.find('.environment-from').val();
            data.to = modal.$element.find('.environment-to').val();

            data.settings.replace = modal.$element.find('#switch-migration-replace').is(':checked');
            
            apiCall('post', 'server/migrate/' + this.model.id, data)
            .then(() => {
                UI.messageModal('Success', 'Successfully migrated content from "' + data.from + '" to "' + data.to + '"');
            })
            .catch(UI.errorModal);
        };

        let data = {
            from: '',
            to: '',
            settings: {
                replace: true
            }
        }

        let modal = new MessageModal({
            model: {
                class: 'modal-migrate-content',
                title: 'Migrate content',
                body: [
                    _.div({class: 'migration-message'},
                        _.span({class: 'fa fa-warning'}),
                        _.span('It might be a good idea to make a project backup before you proceed')
                    ),
                    _.div({class: 'migration-operation'},
                        _.select({class: 'form-control environment-from'},
                            _.each(this.model.settings.environments.names, (i, environment) => {
                                return _.option({value: environment}, environment);  
                            })
                        ).change(() => {
                            updateOptions();
                        }),
                        _.span({class: 'fa fa-arrow-right'}),
                        _.select({class: 'form-control environment-to'})
                    ),
                    _.div({class: 'migration-settings'},
                        _.each({
                            replace: 'Replace content on target'
                        }, (value, label) => {
                            return _.div({class: 'input-group'},      
                                _.span(label),
                                _.div({class: 'input-group-addon'},
                                    _.div({class: 'switch'},
                                        _.input({
                                            id: 'switch-migration-' + value,
                                            class: 'form-control switch',
                                            type: 'checkbox',
                                            checked: data.settings[value]
                                        }),
                                        _.label({for: 'switch-migration-' + value})
                                    )
                                )
                            );
                        })
                    )
                ]
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default'
                },
                {
                    label: 'Migrate',
                    class: 'btn-primary',
                    callback: () => {
                        onSubmit(); 

                        return false;
                    }
                }
            ]
        });

        updateOptions();
    }

    /**
     * Event: Click add environment button
     */
    onClickAddEnvironment() {
        let modal = new MessageModal({
            model: {
                title: 'New environment for "' + this.model.id + '"',
                body: _.input({class: 'form-control', type: 'text', placeholder: 'Type environment name here'})
            },
            buttons: [
                {
                    label: 'Create',
                    class: 'btn-primary',
                    callback: () => {
                        let newName = modal.$element.find('input').val();

                        this.model.settings.environments.names.push(newName);

                        apiCall('post', 'server/settings/' + this.model.id + '/environments', this.model.settings.environments)
                        .then(() => {
                            UI.messageModal('Succes', 'The new environment "' + newName + '" was created successfully', () => { location.reload(); });
                        })
                        .catch(UI.errorModal);

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
                    _.h4(this.model.settings.info.name || this.model.id),
                    _.p(userCount + ' user' + (userCount != 1 ? 's' : '')),
                    _.p(languageCount + ' language' + (languageCount != 1 ? 's' : '') + ' (' + this.model.settings.language.selected.join(', ') + ')')
                ),
                _.div({class: 'environments'},
                    _.each(this.model.settings.environments.names, (i, environment) => {
                        return _.div({class: 'environment'},
                            _.div({class: 'btn-group'},
                                _.span({class: 'environment-title'}, environment),
                                _.a({href: '/' + this.model.id + '/' + environment, class: 'btn btn-primary environment'}, 'cms'),
                                _.if(this.isAdmin(),
                                    _.div({class: 'dropdown'},
                                        _.button({class: 'dropdown-toggle', 'data-toggle': 'dropdown'},
                                            _.span({class: 'fa fa-ellipsis-v'})
                                        ),
                                        _.ul({class: 'dropdown-menu'},
                                            _.li(
                                                _.a({href: '#', class: 'dropdown-item'},
                                                    'Delete'
                                                ).click((e) => { e.preventDefault(); this.onClickRemoveEnvironment(environment); })
                                            )
                                        )
                                    )
                                )
                            )
                        );
                    }),
                    _.if(this.isAdmin(),
                        _.button({class: 'btn btn-primary btn-add btn-raised btn-round'}, '+')
                            .click(() => { this.onClickAddEnvironment(); })
                    )
                )
            )
        );
    }
}

module.exports = ProjectEditor;
