'use strict';

/**
 * The Connection navbar pane
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */
class ConnectionPane extends HashBrown.Views.Navigation.NavbarPane {
    static get route() { return '/connections/'; }
    static get label() { return 'Connections'; }
    static get icon() { return 'exchange'; }
    
    /**
     * Event: Click new connection
     */
    static async onClickNewConnection() {
        let connection = await HashBrown.Helpers.ResourceHelper.new(HashBrown.Models.Connection, 'connections');
        
        location.hash = '/connections/' + connection.id;
    }

    /**
     * Event: On click remove connection
     */
    static onClickRemoveConnection() {
        let $element = $('.context-menu-target'); 
        let id = $element.data('id');
        let name = $element.data('name');
        
        UI.confirmModal('delete', 'Delete connection', 'Are you sure you want to remove the connection "' + name + '"?', async () => {
            await HashBrown.Helpers.ResourceHelper.remove('connections', id);
            
            debug.log('Removed connection "' + id + '"', this); 

            // Cancel the ConnectionEditor view if it was displaying the deleted connection
            if(location.hash == '#/connections/' + id) {
                location.hash = '/connections/';
            }
        });
    }
    
    /**
     * Event: Click pull connection
     */
    static async onClickPullConnection() {
        let connectionEditor = Crisp.View.get('ConnectionEditor');
        let pullId = $('.context-menu-target').data('id');

        // API call to pull the Connection by id
        await HashBrown.Helpers.ResourceHelper.pull('connections', pullId);
        
        location.hash = '/connections/' + pullId;
		
        let editor = Crisp.View.get('ConnectionEditor');

        if(editor && editor.model.id == pullId) {
            editor.model = null;
            editor.fetch();
        }
    }
    
    /**
     * Event: Click push connection
     */
    static async onClickPushConnection() {
		let $element = $('.context-menu-target');
        let pushId = $element.data('id');

		$element.parent().addClass('loading');

        // API call to push the Connection by id
        await HashBrown.Helpers.ResourceHelper.push('connections', pushId);
    }

    /**
     * Gets all items
     *
     * @returns {Promise} Items
     */
    static getItems() {
        return HashBrown.Helpers.ConnectionHelper.getAllConnections();
    }

    /**
     * Item context menu
     */
    static getItemContextMenu(item) {
        let menu = {};
        let isSyncEnabled = HashBrown.Context.projectSettings.sync.enabled;
        
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
    }
      
    /**
     * General context menu
     */
    static getPaneContextMenu() {
        return {
            'Connections': '---',
            'New connection': () => { this.onClickNewConnection(); },
            'Refresh': () => { this.onClickRefreshResource('connections'); }
        };
    }
}

module.exports = ConnectionPane;
