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
        if(this.isAdmin()) {
            let modal = new MessageModal({
                model: {
                    title: 'Remove project',
                    body: 'Are you sure?'
                },
                buttons: [
                    {
                        label: 'Cancel',
                        class: 'btn-default'
                    },
                    {
                        label: 'Remove',
                        class: 'btn-danger',
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

    }

    /**
     * Event: Click admin button
     */
    onClickAdmin() {
        if(this.isAdmin()) {
            new MessageModal({
                model: {
                    class: 'modal-project-admin',
                    title: this.model.name + ' administration',
                    body: _.div({},
                        _.h4('Backups'),
                        _.span({class: 'btn-group'},
                            _.button({class: 'btn btn-primary btn-backup'}, 'Create')
                                .click(() => { this.onClickCreateBackup(); }),
                            _.button({class: 'btn btn-default btn-group-addon btn-upload'},
                                _.span({class: 'fa fa-upload'})
                            ).click(() => { this.onClickUploadBackup(); })
                        ),
                        _.each(this.model.backups, (i, backup) => {
                            let date = new Date(parseInt(backup));

                            return _.div({class: 'project-backup'},
                                _.p({class: 'project-backup-name'}, date.toString()),
                                _.div({class: 'btn-group'},
                                    _.button({class: 'btn btn-primary btn-restore'}, 'Restore')
                                        .click(() => { this.onClickRestoreBackup(backup); }),
                                    _.a({class: 'btn btn-default btn-group-addon btn-download', href: apiUrl('server/backups/' + this.model.name + '/' + backup)},
                                        _.span({class: 'fa fa-download'})
                                    )
                                )
                            );
                        })
                    )
                }
            }); 
        }
    }

    render() {
        let environmentCount = this.model.settings.environments.names.length;
        let languageCount = this.model.settings.language.selected.length;
        let userCount = this.model.users.length;

        this.$element = _.div({class: 'raised project-editor'},
            _.if(this.isAdmin(),
                _.button({class: 'btn btn-embedded btn-remove'},
                    _.span({class: 'fa fa-remove'})
                ).click(() => { this.onClickRemove(); })
            ),
            _.div({class: 'body'},
                _.div({class: 'info'},
                    _.h4(this.model.name),
                    _.p(environmentCount + ' environment' + (environmentCount != 1 ? 's' : '')),
                    _.p(userCount + ' user' + (userCount != 1 ? 's' : '')),
                    _.p(languageCount + ' language' + (languageCount != 1 ? 's' : '') + ' (' + this.model.settings.language.selected.join(', ') + ')')
                ),
                _.div({class: 'environments'},
                    _.each(this.model.settings.environments.names, (i, environment) => {
                        return _.div({class: 'environment'},
                            _.div({class: 'btn-group'},
                                _.span({class: 'environment-title'}, environment),
                                _.a({href: '/' + this.model.name + '/' + environment, class: 'btn btn-primary environment'}, 'cms'),
                                _.if(this.isAdmin(),
                                    _.button({class: 'btn btn-group-addon btn-admin btn-default'}, 
                                        _.span({class: 'fa fa-cogs'})
                                    ).click(() => { this.onClickAdmin(); })
                                )
                            )
                        );
                    })
                )
            )
        );
    }
}

module.exports = ProjectEditor;
