'use strict';

/**
 * The editor for projects as seen on the dashboard
 */
class ProjectEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'raised project-editor'});

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
     * Event: Click info button
     */
    onClickInfo() {
        if(this.isAdmin()) {
            let infoEditor = new InfoEditor({ projectId: this.model.id });

            infoEditor.on('change', (newInfo) => {
                this.model.settings.info = newInfo;

                this.fetch();
            });
        }
    }
    
    /**
     * Event: Click languages button
     */
    onClickLanguages() {
        if(this.isAdmin()) {
            let languageEditor = new LanguageEditor({ projectId: this.model.id });
            
            languageEditor.on('change', (newLanguages) => {
                this.model.settings.language.selected = newLanguages;

                this.fetch();
            });
        }
    }

    /**
     * Event: Click backups button
     */
    onClickBackups() {
        if(this.isAdmin()) {
            new BackupEditor({ model: this.model });
        }
    }

    /**
     * Event: Click migration button
     */
    onClickMigrate() {
        if(this.isAdmin()) {
            new MigrationEditor({ model: this.model });
        }
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

        _.append(this.$element.empty(),
            _.div({class: 'body'},
                _.if(this.isAdmin(),
                    _.div({class: 'admin dropdown'}, 
                        _.button({class: 'dropdown-toggle', 'data-toggle': 'dropdown'},
                            _.span({class: 'fa fa-ellipsis-v'})
                        ),
                        _.ul({class: 'dropdown-menu'},
                            _.li(
                                _.a({href: '#', class: 'dropdown-item'}, 
                                    'Info'
                                ).click((e) => { e.preventDefault(); this.onClickInfo(); })
                            ),
                            _.li(
                                _.a({href: '#', class: 'dropdown-item'}, 
                                    'Languages'
                                ).click((e) => { e.preventDefault(); this.onClickLanguages(); })
                            ),
                            _.li(
                                _.a({href: '#', class: 'dropdown-item'}, 
                                    'Backups'
                                ).click((e) => { e.preventDefault(); this.onClickBackups(); })
                            ),
                            _.if(this.model.settings.environments.names.length > 1,
                                _.li(
                                    _.a({href: '#', class: 'dropdown-item'}, 
                                        'Migrate'
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
