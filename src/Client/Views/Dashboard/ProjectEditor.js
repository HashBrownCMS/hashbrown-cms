'use strict';

/**
 * The editor for projects as seen on the dashboard
 *
 * @memberof HashBrown.Client.Views.Dashboard
 */
class ProjectEditor extends Crisp.View {
    constructor(params) {
        super(params);

        _.append(this.element,
            _.div({class: 'widget--spinner embedded'},
                _.div({class: 'widget--spinner__image fa fa-refresh'})
            )
        );

        this.fetch();
    }
   
    /**
     * Event: Click remove button
     */ 
    onClickRemove() {
        if(!currentUserIsAdmin()) { return; }

        let modal = new HashBrown.Views.Modals.Modal({
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
                    onClick: () => {
                        HashBrown.Helpers.RequestHelper.request('delete', 'server/projects/' + this.model.id)
                        .then(() => {
                            location.reload();
                        })
                        .catch(UI.errorModal);
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
        let modal = UI.confirmModal('Remove', 'Remove environment "' + environmentName + '"', 'Are you sure want to remove the environment "' + environmentName + '" from the project "' + (this.model.settings.info.name || this.model.id) + '"?', () => {
            HashBrown.Helpers.RequestHelper.request('delete', 'server/projects/' + this.model.id + '/' + environmentName)
            .then(() => {
                this.model = null;
                this.fetch();
            })
            .catch(UI.errorModal);
        });
    }
    
    /**
     * Event: Click info button */
    onClickInfo() {
        if(!currentUserIsAdmin()) { return; }
        
        new HashBrown.Views.Dashboard.InfoEditor({
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

        new HashBrown.Views.Dashboard.SyncEditor({
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
        
        new HashBrown.Views.Dashboard.LanguageEditor({
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
        
        new HashBrown.Views.Dashboard.BackupEditor({
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
    
        new HashBrown.Views.Dashboard.MigrationEditor({
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
        let modal = new HashBrown.Views.Modals.Modal({
            title: 'New environment for "' + this.model.id + '"',
            body: _.div({class: 'widget-group'},
                _.label({class: 'widget widget--label'}, 'Environment name'),
                new HashBrown.Views.Widgets.Input({
                    placeholder: 'i.e. "testing" or "staging"'
                })
            ),
            actions: [
                {
                    label: 'Create',
                    onClick: () => {
                        let environmentName = modal.$element.find('input').val();

                        if(!environmentName) { return false; }

                        HashBrown.Helpers.RequestHelper.request('put', 'server/projects/' + this.model.id + '/' + environmentName)
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
     * Pre render
     */
    prerender() {
        if(this.model instanceof HashBrown.Models.Project === false) {
            this.model = new HashBrown.Models.Project(this.model);
        }
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
                    new HashBrown.Views.Widgets.Dropdown({
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
                    _.h4(this.model.settings.info.name || this.model.id),
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
                                new HashBrown.Views.Widgets.Dropdown({
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
                        _.button({title: 'Add environment', class: 'widget widget--button round right fa fa-plus'})
                            .click(() => { this.onClickAddEnvironment(); })
                    )
                )
            )
        );
    }
}

module.exports = ProjectEditor;
