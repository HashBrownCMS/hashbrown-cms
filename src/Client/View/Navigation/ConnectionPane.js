'use strict';

/**
 * The Connection navbar pane
 * 
 * @memberof HashBrown.Client.View.Navigation
 */
class ConnectionPane extends HashBrown.View.Navigation.NavbarPane {
    static get route() { return '/connections/'; }
    static get label() { return 'Connections'; }
    static get scope() { return 'connections'; }
    static get icon() { return 'exchange'; }
    
    /**
     * Gets all items
     */
    async fetch() {
        this.items = await HashBrown.Service.ConnectionService.getAllConnections();

        super.fetch();
    }

    /**
     * Event: Click new connection
     */
    async onClickNewConnection() {
        let connection = await HashBrown.Service.ResourceService.new(HashBrown.Entity.Resource.Connection, 'connections');
        
        location.hash = '/connections/' + connection.id;
    }

    /**
     * Event: On click remove connection
     */
    async onClickRemoveConnection(target) {
        let id = target.dataset.id;
        let connection = await HashBrown.Service.ConnectionService.getConnectionById(id);

        UI.confirm('Delete connection', 'Are you sure you want to remove this connection "' + connection.title + '"?', async () => {
            await HashBrown.Service.ResourceService.remove('connections', id);
        });
    }
    
    /**
     * Event: Click pull connection
     */
    async onClickPullConnection(target) {
        let id = target.dataset.id;

        await HashBrown.Service.ResourceService.pull('connections', id);    
    }
    
    /**
     * Event: Click push connection
     */
    async onClickPushConnection(target) {
        let id = target.dataset.id;

        await HashBrown.Service.ResourceService.push('connections', id);
    }

    /**
     * Item context menu
     */
    getItemContextMenu(item) {
        let menu = {};
        let isSyncEnabled = HashBrown.Context.projectSettings.sync.enabled;
        
        if(item.isLocked && !item.sync.isRemote) { isSyncEnabled = false; }
        
        menu['This connection'] = '---';

        if(!item.sync.hasRemote && !item.sync.isRemote && !item.isLocked) {
            menu['Remove'] = (target) => { this.onClickRemoveConnection(target); };
        }
        
        menu['Copy id'] = (target) => { this.onClickCopyItemId(target); };

        if(isSyncEnabled) {
            menu['Sync'] = '---';

            if(!item.sync.isRemote) {
                menu['Push to remote'] = (target) => { this.onClickPushConnection(target); };
            }

            if(item.sync.hasRemote) {
                menu['Remove local copy'] = (target) => { this.onClickRemoveConnection(target); };
            }
            
            if(item.sync.isRemote) {
                menu['Pull from remote'] = (target) => { this.onClickPullConnection(target); };
            }
        }
        
        menu['General'] = '---';
        menu['New connection'] = () => { this.onClickNewConnection(); };

        return menu;
    }
      
    /**
     * General context menu
     */
    getPaneContextMenu() {
        return {
            'Connections': '---',
            'New connection': () => { this.onClickNewConnection(); }
        };
    }
}

module.exports = ConnectionPane;
