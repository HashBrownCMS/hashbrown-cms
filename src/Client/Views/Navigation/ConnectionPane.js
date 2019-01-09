'use strict';

/**
 * The Connection navbar pane
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */
class ConnectionPane extends HashBrown.Views.Navigation.NavbarPane {
    /**
     * Event: Click new connection
     */
    static onClickNewConnection() {
        let newConnection;

        HashBrown.Helpers.RequestHelper.request('post', 'connections/new')
        .then((connection) => {
            newConnection = connection;

            return HashBrown.Helpers.RequestHelper.reloadResource('connections');
        })
        .then(() => {
            HashBrown.Views.Navigation.NavbarMain.reload();

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
            HashBrown.Helpers.RequestHelper.request('delete', 'connections/' + id)
            .then(() => {
                debug.log('Removed connection with alias "' + id + '"', this); 

                return HashBrown.Helpers.RequestHelper.reloadResource('connections');
            })
            .then(() => {
                HashBrown.Views.Navigation.NavbarMain.reload();

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
        HashBrown.Helpers.RequestHelper.request('post', 'connections/pull/' + pullId, {})
        
        // Upon success, reload all Connection models    
        .then(() => {
            return HashBrown.Helpers.RequestHelper.reloadResource('connections');
        })

        // Reload the UI
        .then(() => {
            HashBrown.Views.Navigation.NavbarMain.reload();

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
        HashBrown.Helpers.RequestHelper.request('post', 'connections/push/' + pushId)

        // Upon success, reload all Connection models
        .then(() => {
            return HashBrown.Helpers.RequestHelper.reloadResource('connections');
        })

        // Reload the UI
        .then(() => {
            HashBrown.Views.Navigation.NavbarMain.reload();
        }) 
        .catch(UI.errorModal);
    }

    /**
     * Init
     */
    static init() {
        if(!currentUserHasScope('connections')) { return; }

        HashBrown.Views.Navigation.NavbarMain.addTabPane('/connections/', 'Connections', 'exchange', {
            icon: 'exchange',
            
            getItems: () => { return resources.connections; },

            // Item context menu
            getItemContextMenu: (item) => {
                let menu = {};
                let isSyncEnabled = HashBrown.Helpers.SettingsHelper.getCachedSettings(HashBrown.Helpers.ProjectHelper.currentProject, null, 'sync').enabled;
                
                menu['This connection'] = '---';

                menu['Open in new tab'] = () => { this.onClickOpenInNewTab(); };

                if(!item.sync.hasRemote && !item.sync.isRemote && !item.isLocked) {
                    menu['Remove'] = () => { this.onClickRemoveConnection(); };
                }
                
                menu['Copy id'] = () => { this.onClickCopyItemId(); };

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
                
                menu['General'] = '---';
                menu['New connection'] = () => { this.onClickNewConnection(); };
                menu['Refresh'] = () => { this.onClickRefreshResource('connections'); };

                return menu;
            },
            
            // General context menu
            paneContextMenu: {
                'Connections': '---',
                'New connection': () => { this.onClickNewConnection(); },
                'Refresh': () => { this.onClickRefreshResource('connections'); }
            }
        });
    }
}

module.exports = ConnectionPane;
