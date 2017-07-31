'use strict';

const ProjectHelper = require('Client/Helpers/ProjectHelper');

const NavbarPane = require('./NavbarPane');
const NavbarMain = require('./NavbarMain');

/**
 * The Connection navbar pane
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */
class ConnectionPane extends NavbarPane {
    /**
     * Event: Click new connection
     */
    static onClickNewConnection() {
        let newConnection;

        apiCall('post', 'connections/new')
        .then((connection) => {
            newConnection = connection;

            return reloadResource('connections');
        })
        .then(() => {
            NavbarMain.reload();

            location.hash = '/connections/' + newConnection.id;
        })
        .catch(UI.errorModal);
    }

    /**
     * Event: On click remove connection
     */
    static onClickRemoveConnection() {
        let $element = $('.cr-context-menu__target-element'); 
        let id = $element.data('id');
        let name = $element.data('name');
        
        new HashBrown.Views.Modals.MessageModal({
            model: {
                title: 'Delete content',
                body: 'Are you sure you want to remove the connection "' + name + '"?'
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default',
                },
                {
                    label: 'OK',
                    class: 'btn-danger',
                    callback: () => {
                        apiCall('delete', 'connections/' + id)
                        .then(() => {
                            debug.log('Removed connection with alias "' + id + '"', this); 

                            return reloadResource('connections');
                        })
                        .then(() => {
                            NavbarMain.reload();

                            // Cancel the ConnectionEditor view if it was displaying the deleted connection
                            if(location.hash == '#/connections/' + id) {
                                location.hash = '/connections/';
                            }
                        })
                        .catch(UI.errorModal);
                    }
                }
            ]
        });
    }
    
    /**
     * Event: Click pull connection
     */
    static onClickPullConnection() {
        let connectionEditor = ViewHelper.get('ConnectionEditor');
        let pullId = $('.cr-context-menu__target-element').data('id');

        // API call to pull the Connection by id
        apiCall('post', 'connections/pull/' + pullId, {})
        
        // Upon success, reload all Connection models    
        .then(() => {
            return reloadResource('connections');
        })

        // Reload the UI
        .then(() => {
            NavbarMain.reload();

			location.hash = '/connections/' + pullId;
		
			let editor = ViewHelper.get('ConnectionEditor');

			if(editor && editor.model.id == pullId) {
                editor.model = null;
				editor.fetch();
			}
        }) 
        .catch(UI.errorModal);
    }
    
    /**
     * Event: Click push connection
     */
    static onClickPushConnection() {
		let $element = $('.cr-context-menu__target-element');
        let pushId = $element.data('id');

		$element.parent().addClass('loading');

        // API call to push the Connection by id
        apiCall('post', 'connections/push/' + pushId)

        // Upon success, reload all Connection models
        .then(() => {
            return reloadResource('connections');
        })

        // Reload the UI
        .then(() => {
            NavbarMain.reload();
        }) 
        .catch(UI.errorModal);
    }

    /**
     * Init
     */
    static init() {
        NavbarMain.addTabPane('/connections/', 'Connections', 'exchange', {
            getItems: () => { return resources.connections; },

            // Item context menu
            getItemContextMenu: (item) => {
                let menu = {};
                let isSyncEnabled = HashBrown.Helpers.SettingsHelper.getCachedSettings(ProjectHelper.currentProject, null, 'sync').enabled;
                
                menu['This connection'] = '---';
                menu['Copy id'] = () => { this.onClickCopyItemId(); };

                if(!item.local && !item.remote && !item.locked) {
                    menu['Remove'] = () => { this.onClickRemoveConnection(); };
                }
                
                if(item.locked && !item.remote) { isSyncEnabled = false; }

                if(isSyncEnabled) {
                    menu['Sync'] = '---';

                    if(!item.remote) {
                        menu['Push to remote'] = () => { this.onClickPushConnection(); };
                    }

                    if(item.local) {
                        menu['Remove local copy'] = () => { this.onClickRemoveConnection(); };
                    }
                    
                    if(item.remote) {
                        menu['Pull from remote'] = () => { this.onClickPullConnection(); };
                    }
                }

                return menu;
            },
            
            // General context menu
            paneContextMenu: {
                'General': '---',
                'New connection': () => { this.onClickNewConnection(); }
            }
        });
    }
}

module.exports = ConnectionPane;
