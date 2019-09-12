'use strict';

/**
 * The editor for projects as seen on the dashboard
 *
 * @memberof HashBrown.Client.View.Dashboard
 */
class ProjectEditor extends Crisp.View {
    constructor(params) {
        super(params);

        UI.spinner(this.element, true);

        this.fetch();
    }

    /**
     * Fetches the model
     */
    async fetch() {
        try {
            this.model = await HashBrown.Service.RequestService.request('get', 'server/projects/' + this.modelId);
            this.model = new HashBrown.Entity.Project(this.model);

            super.fetch();

        } catch(e) {
            UI.errorModal(e);

        }
    }
        
    /**
     * Event: Click remove button
     */ 
    onClickRemove() {
        if(!currentUserIsAdmin()) { return; }

        let modal = new HashBrown.View.Modal.Modal({
            title: 'Delete ' + this.model.settings.info.name,
            body: _.div({class: 'widget-group'},
                _.p({class: 'widget widget--label'}, 'Type the project name to confirm'),
                _.input({class: 'widget widget--input text', type: 'text', placeholder: this.model.settings.info.name})
                    .on('input', (e) => {
                        let $btn = modal.$element.find('.widget.warning');
                        let isMatch = $(e.target).val() == this.model.settings.info.name;
                        
                        $btn.toggleClass('disabled', !isMatch);
                    })
            ),
            actions: [
                {
                    label: 'Cancel',
                    class: 'default'
                },
                {
                    label: 'Delete',
                    class: 'warning disabled',
                    onClick: async () => {
                        try {
                            await HashBrown.Service.RequestService.request('delete', 'server/projects/' + this.model.id);

                            this.remove();

                        } catch(e) {
                            UI.errorModal(e); 
                        
                        }
                    }
                }
            ]
        });
    }

    /**
     * Event: Click remove environment
     *
     * @param {String} environmentName
     */
    onClickRemoveEnvironment(environmentName) {
        let modal = UI.confirmModal('Remove', 'Remove environment "' + environmentName + '"', 'Are you sure want to remove the environment "' + environmentName + '" from the project "' + (this.model.settings.info.name || this.model.id) + '"?', async () => {
            try {
                await HashBrown.Service.RequestService.request('delete', 'server/projects/' + this.model.id + '/' + environmentName);

                this.model = null;
                this.fetch();
            
            } catch(e) {
                UI.errorModal(e);

            }
        });
    }
    
    /**
     * Event: Click info button */
    onClickInfo() {
        if(!currentUserIsAdmin()) { return; }
        
        new HashBrown.View.Dashboard.InfoEditor({
            modelUrl: '/api/server/projects/' + this.model.id
        })
        .on('change', (newInfo) => {
            this.model = null;
            this.fetch();
        });
    }
    
    /**
     * Event: Click sync button
     */
    onClickSync() {
        if(!currentUserIsAdmin()) { return; }

        new HashBrown.View.Dashboard.SyncEditor({
            projectId: this.model.id,
            modelUrl: '/api/' + this.model.id + '/settings/sync'
        })
        .on('change', (newSettings) => {
            this.model = null;
            this.fetch();
        });
    }
    
    /**
     * Event: Click languages button
     */
    onClickLanguages() {
        if(!currentUserIsAdmin()) { return; }
        
        new HashBrown.View.Dashboard.LanguageEditor({
            modelUrl: '/api/server/projects/' + this.model.id
        })
        .on('change', () => {
            this.model = null;
            this.fetch();
        });
    }

    /**
     * Event: Click backups button
     */
    onClickBackups() {
        if(!currentUserIsAdmin()) { return; }
        
        new HashBrown.View.Dashboard.BackupEditor({
            modelUrl: '/api/server/projects/' + this.model.id
        })
        .on('change', () => {
            this.model = null;
            this.fetch();
        });
    }

    /**
     * Event: Click migration button
     */
    onClickMigrate() {
        if(!currentUserIsAdmin()) { return; }

        if(this.model.environments.length < 2) {
            UI.errorModal(new Error('You need at least 2 environments to migrate content'));
            return;
        }
    
        new HashBrown.View.Dashboard.MigrationEditor({
            model: this.model
        })
        .on('change', () => {
            this.model = null;
            this.fetch();
        });
    }

    /**
     * Event: Click add environment button
     */
    onClickAddEnvironment() {
        let modal = new HashBrown.View.Modal.Modal({
            title: 'New environment for "' + this.model.settings.info.name + '"',
            body: _.div({class: 'widget-group'},
                _.label({class: 'widget widget--label'}, 'Environment name'),
                new HashBrown.View.Widget.Input({
                    placeholder: 'i.e. "testing" or "staging"'
                })
            ),
            actions: [
                {
                    label: 'Create',
                    onClick: () => {
                        let environmentName = modal.$element.find('input').val();

                        if(!environmentName) { return false; }

                        HashBrown.Service.RequestService.request('put', 'server/projects/' + this.model.id + '/' + environmentName)
                        .then(() => {
                            modal.close();

                            this.model = null;
                            this.fetch();
                        })
                        .catch(UI.errorModal);

                        return false;
                    }
                }
            ]
        });
    }

    /**
     * Renders this editor
     */
    template() {
        let languageCount = this.model.settings.languages.length;
        let userCount = this.model.users.length;

        return _.div({class: 'page--dashboard__project in'},
            _.div({class: 'page--dashboard__project__body'},
                _.if(currentUserIsAdmin(),
                    new HashBrown.View.Widget.Dropdown({
                        icon: 'ellipsis-v',
                        reverseKeys: true,
                        options: {
                            'Info': () => { this.onClickInfo(); },
                            'Languages': () => { this.onClickLanguages(); },
                            'Backups': () => { this.onClickBackups(); },
                            'Sync': () => { this.onClickSync(); },
                            'Delete': () => { this.onClickRemove(); },
                            'Migrate content': () => { this.onClickMigrate(); }
                        }
                    }).$element.addClass('page--dashboard__project__menu')
                ),
                _.div({class: 'page--dashboard__project__info'},
                    _.h3({class: 'page--dashboard__project__info__name'}, this.model.settings.info.name || this.model.id),
                    _.p(userCount + ' user' + (userCount != 1 ? 's' : '')),
                    _.p(languageCount + ' language' + (languageCount != 1 ? 's' : '') + ' (' + this.model.settings.languages.join(', ') + ')')
                ),
                _.div({class: 'page--dashboard__project__environments'},
                    _.each(this.model.environments, (i, environment) => {
                        return _.div({class: 'page--dashboard__project__environment'},
                            _.a({title: 'Go to "' + environment + '" CMS', href: '/' + this.model.id + '/' + environment, class: 'widget widget--button expanded'}, 
                                environment
                            ),
                            _.if(currentUserIsAdmin(),
                                new HashBrown.View.Widget.Dropdown({
                                    icon: 'ellipsis-v',
                                    reverseKeys: true,
                                    options: {
                                        'Delete': () => { this.onClickRemoveEnvironment(environment); }
                                    }
                                }).$element.addClass('page--dashboard__project__environment__menu')
                            )
                        );
                    }),
                    _.if(currentUserIsAdmin(),
                        _.button({title: 'Add environment', class: 'widget widget--button dashed embedded expanded'},
                            _.span({class: 'fa fa-plus'}),
                            'Add environment'
                        ).click(() => { this.onClickAddEnvironment(); })
                    )
                )
            )
        );
    }
}

module.exports = ProjectEditor;
