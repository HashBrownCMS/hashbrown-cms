'use strict';

class ConnectionPane extends NavbarPane {
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
        let $element = $('.context-menu-target-element'); 
        let id = $element.data('id');
        let name = $element.data('name');
        
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
        let navbar = ViewHelper.get('NavbarMain');
		let $element = $('.context-menu-target-element');
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
            navbar.reload();
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
                let isSyncEnabled = SettingsHelper.getCachedSettings('sync').enabled == true;
                
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
