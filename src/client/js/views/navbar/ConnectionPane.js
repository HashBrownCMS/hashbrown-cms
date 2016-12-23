'use strict';

let Pane = require('./Pane');

class ConnectionPane extends Pane {
    /**
     * Event: Click new connection
     */
    static onClickNewConnection() {
        let navbar = ViewHelper.get('NavbarMain');
        let newConnection;

        apiCall('post', 'connections/new')
        .then((connection) => {
            newConnection = connection;

            return reloadResource('connections');
        })
        .then(() => {
            navbar.reload();

            location.hash = '/connections/' + newConnection.id;
        })
        .catch(navbar.onError);
    }

    /**
     * Event: On click remove connection
     */
    static onClickRemoveConnection() {
        let navbar = ViewHelper.get('NavbarMain');
        let id = $('.context-menu-target-element').data('id');
        let name = $('.context-menu-target-element').data('name');
        
        function onSuccess() {
            debug.log('Removed connection with alias "' + id + '"', navbar); 
        
            reloadResource('connections')
            .then(function() {
                navbar.reload();
                
                // Cancel the ConnectionEditor view if it was displaying the deleted connection
                if(location.hash == '#/connections/' + id) {
                    location.hash = '/connections/';
                }
            });
        }

        new MessageModal({
            model: {
                title: 'Delete content',
                body: 'Are you sure you want to remove the connection "' + name + '"?'
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default',
                    callback: function() {
                    }
                },
                {
                    label: 'OK',
                    class: 'btn-danger',
                    callback: function() {
                        apiCall('delete', 'connections/' + id)
                        .then(onSuccess)
                        .catch(UI.erroroModal);
                    }
                }
            ]
        });
    }
    
    /**
     * Event: Click pull connection
     */
    static onClickPullConnection() {
        let navbar = ViewHelper.get('NavbarMain');
        let connectionEditor = ViewHelper.get('ConnectionEditor');
        let pullId = $('.context-menu-target-element').data('id');

        // API call to pull the Connection by id
        apiCall('post', 'connections/pull/' + pullId, {})
        
        // Upon success, reload all Connection models    
        .then(() => {
            return reloadResource('connections');
        })

        // Reload the UI
        .then(() => {
            navbar.reload();


            if(connectionEditor && connectionEditor.model.id == pullId) {
                connectionEditor.model = null;
                connectionEditor.fetch();
            }
        }) 
        .catch(UI.errorModal);
    }
    
    /**
     * Event: Click push connection
     */
    static onClickPushConnection() {
        let navbar = ViewHelper.get('NavbarMain');
        let pushId = $('.context-menu-target-element').data('id');

        // API call to push the Connection by id
        apiCall('post', 'connections/push/' + pushId)

        // Upon success, reload all Connection models
        .then(() => {
            return reloadResource('connections');
        })

        // Reload the UI
        .then(() => {
            navbar.reload();
        }) 
        .catch(UI.errorModal);
    }

    /**
     * Renders the toolbar
     *
     * @returns {HTMLElement} The toolbar element
     */
    static renderToolbar() {
        let $mediaProvider;
        let $templateProvider;

        function onChangeMediaProvider() {
            ConnectionHelper.setMediaProvider(ProjectHelper.currentProject, ProjectHelper.currentEnvironment, $(this).val())
            .then(() => {
                return reloadResource('media');
            })
            .then(() => {
                ViewHelper.get('NavbarMain').reload();
            })
            .catch(UI.errorModal);
        }

        function onChangeTemplateProvider() {
            ConnectionHelper.setTemplateProvider(ProjectHelper.currentProject, ProjectHelper.currentEnvironment, $(this).val())
            .then(() => {
                return reloadResource('templates');
            })
            .then(() => {
                return reloadResource('sectionTemplates');
            })
            .then(() => {
                ViewHelper.get('NavbarMain').reload();
            })
            .catch(UI.errorModal);
        }

        let $toolbar = _.div({class: 'pane-toolbar'},
            _.div({},
                _.label('Media provider'),
                $mediaProvider = _.select({class: 'btn btn-primary'},
                    _.option({value: null}, '(none)'),
                    _.each(resources.connections, (i, connection) => {
                        return _.option({value: connection.id},
                            connection.title
                        );
                    })
                ).change(onChangeMediaProvider)
            ),
            _.div({},
                _.label('Template provider'),
                $templateProvider = _.select({class: 'btn btn-primary'},
                    _.option({value: null}, '(none)'),
                    _.each(resources.connections, (i, connection) => {
                        return _.option({value: connection.id},
                            connection.title
                        );
                    })
                ).change(onChangeTemplateProvider)
            )
        );
        
        SettingsHelper.getSettings(ProjectHelper.currentProject, ProjectHelper.currentEnvironment, 'providers')
        
        // Previously, providers were set project-wide, so retrieve automatically if needed
        .then((providers) => {
            if(!providers) {
                return SettingsHelper.getSettings(ProjectHelper.currentProject, null, 'providers');
            
            } else {
                return Promise.resolve(providers);
            }
        })

        // Set providers values
        .then((providers) => {
            providers = providers || {};

            $mediaProvider.val(providers.media);
            $templateProvider.val(providers.template);
        })
        .catch(UI.errorModal);

        return $toolbar;
    }

    /**
     * Gets render settings
     *
     * @returns {Object} settings
     */
    static getRenderSettings() {
        return {
            label: 'Connections',
            route: '/connections/',
            icon: 'exchange',
            items: resources.connections,
            toolbar: this.renderToolbar(),

            // Item context menu
            getItemContextMenu: (item) => {
                let menu = {};
                
                menu['This connection'] = '---';
                menu['Copy id'] = () => { this.onClickCopyItemId(); };

                if(!item.local && !item.remote && !item.locked) {
                    menu['Remove'] = () => { this.onClickRemoveConnection(); };
                }

                if(item.local || item.remote) {
                    menu['Sync'] = '---';
                }

                if(item.local) {
                    menu['Push to remote'] = () => { this.onClickPushConnection(); };
                    menu['Remove local copy'] = () => { this.onClickRemoveConnection(); };
                }
                
                if(item.remote) {
                    menu['Pull from remote'] = () => { this.onClickPullConnection(); };
                }

                return menu;
            },
            
            // General context menu
            paneContextMenu: {
                'General': '---',
                'New connection': () => { this.onClickNewConnection(); }
            }
        };
    }
}

module.exports = ConnectionPane;
