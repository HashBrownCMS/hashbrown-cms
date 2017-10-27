'use strict';

const ProjectHelper = require('Client/Helpers/ProjectHelper');
const RequestHelper = require('Client/Helpers/RequestHelper');

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

        RequestHelper.request('post', 'connections/new')
        .then((connection) => {
            newConnection = connection;

            return RequestHelper.reloadResource('connections');
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
        let $element = $('.context-menu-target'); 
        let id = $element.data('id');
        let name = $element.data('name');
        
        new UI.confirmModal('delete', 'Delete connection', 'Are you sure you want to remove the connection "' + name + '"?', () => {
            RequestHelper.request('delete', 'connections/' + id)
            .then(() => {
                debug.log('Removed connection with alias "' + id + '"', this); 

                return RequestHelper.reloadResource('connections');
            })
            .then(() => {
                NavbarMain.reload();

                // Cancel the ConnectionEditor view if it was displaying the deleted connection
                if(location.hash == '#/connections/' + id) {
                    location.hash = '/connections/';
                }
            })
            .catch(UI.errorModal);
        });
    }
    
    /**
     * Event: Click pull connection
     */
    static onClickPullConnection() {
        let connectionEditor = Crisp.View.get('ConnectionEditor');
        let pullId = $('.context-menu-target').data('id');

        // API call to pull the Connection by id
        RequestHelper.request('post', 'connections/pull/' + pullId, {})
        
        // Upon success, reload all Connection models    
        .then(() => {
            return RequestHelper.reloadResource('connections');
        })

        // Reload the UI
        .then(() => {
            NavbarMain.reload();

			location.hash = '/connections/' + pullId;
		
			let editor = Crisp.View.get('ConnectionEditor');

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
		let $element = $('.context-menu-target');
        let pushId = $element.data('id');

		$element.parent().addClass('loading');

        // API call to push the Connection by id
        RequestHelper.request('post', 'connections/push/' + pushId)

        // Upon success, reload all Connection models
        .then(() => {
            return RequestHelper.reloadResource('connections');
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
        if(!currentUserHasScope('connections')) { return; }

        NavbarMain.addTabPane('/connections/', 'Connections', 'exchange', {
            getItems: () => { return resources.connections; },

            // Item context menu
            getItemContextMenu: (item) => {
                let menu = {};
                let isSyncEnabled = HashBrown.Helpers.SettingsHelper.getCachedSettings(ProjectHelper.currentProject, null, 'sync').enabled;
                
                menu['This connection'] = '---';
                menu['Copy id'] = () => { this.onClickCopyItemId(); };

                if(!item.sync.hasRemote && !item.sync.isRemote && !item.isLocked) {
                    menu['Remove'] = () => { this.onClickRemoveConnection(); };
                }
                
                if(item.isLocked && !item.sync.isRemote) { isSyncEnabled = false; }

                if(isSyncEnabled) {
                    menu['Sync'] = '---';

                    if(!item.sync.isRemote) {
                        menu['Push to remote'] = () => { this.onClickPushConnection(); };
                    }

                    if(item.sync.hasRemote) {
                        menu['Remove local copy'] = () => { this.onClickRemoveConnection(); };
                    }
                    
                    if(item.sync.isRemote) {
                        menu['Pull from remote'] = () => { this.onClickPullConnection(); };
                    }
                }

                return menu;
            },
            
            // General context menu
            paneContextMenu: {
                'General': '---',
                'New connection': () => { this.onClickNewConnection(); },
                'Refresh': () => { this.onClickRefreshResource('connections'); }
            }
        });
    }
}

module.exports = ConnectionPane;
