'use strict';

/**
 * The Schema navbar pane
 * 
 * @memberof HashBrown.Client.View.Navigation
 */
class SchemaPane extends HashBrown.View.Navigation.NavbarPane {
    static get route() { return '/schemas/'; }
    static get label() { return 'Schema'; }
    static get scope() { return 'schemas'; }
    static get icon() { return 'gears'; }
    
    /**
     * Gets all items
     */
    async fetch() {
        this.items = await HashBrown.Service.SchemaService.getAllSchemas();

        // Apply the appropriate icon to each item
        for(let schema of this.items) { 
            if(!schema.icon) {
                let compiledSchema = await HashBrown.Service.SchemaService.getSchemaById(schema.id, true);

                schema.icon = compiledSchema.icon;
            }
        }

        super.fetch();
    }
    
    /**
     * Event: Click new Schema
     */
    async onClickNewSchema(target) {
        let parentId = target ? target.dataset.id : '';
        let newSchema = await HashBrown.Service.ResourceService.new(null, 'schemas', '?parentSchemaId=' + parentId);

        location.hash = '/schemas/' + newSchema.id;
    }
    
    /**
     * Event: Click remove schema
     */
    async onClickRemoveSchema(target) {
        let id = target.dataset.id;
        let schema = await HashBrown.Service.SchemaService.getSchemaById(id);
		
        if(!schema.isLocked) {
            UI.confirm('Delete schema', 'Are you sure you want to delete the schema "' + schema.name + '"?', async () => {
                await HashBrown.Service.SchemaService.removeSchemaById(id);
            });
        } else {
            UI.notify(
                'Delete schema',
                'The schema "' + schema.name + '" is locked and cannot be removed'
            );
        }
    }

    /**
     * Event: Click pull Schema
     */
    async onClickPullSchema(target) {
        let id = target.dataset.id;
		
        await HashBrown.Service.SchemaService.pullSchemaById(id);
    }
    
    /**
     * Event: Click push Schema
     */
    async onClickPushSchema(target) {
		let id = target.dataset.id;

        await HashBrown.Service.SchemaService.pushSchemaById(id);
    }

    /**
     * Item context menu
     */
    getItemContextMenu(item) {
        let menu = {};
        let isSyncEnabled = HashBrown.Context.projectSettings.sync.enabled;

        if(item.isLocked && !item.sync.isRemote) { isSyncEnabled = false; }

        menu['This schema'] = '---';
        
        menu['New child schema'] = (target) => { this.onClickNewSchema(target); };
        
        if(!item.sync.hasRemote && !item.sync.isRemote && !item.isLocked) {
            menu['Remove'] = (target) => { this.onClickRemoveSchema(target); };
        }
        
        menu['Copy id'] = (target) => { this.onClickCopyItemId(target); };
        
        if(isSyncEnabled) {
            menu['Sync'] = '---';
            
            if(!item.sync.isRemote) {
                menu['Push to remote'] = (target) => { this.onClickPushSchema(target); };
            }

            if(item.sync.hasRemote) {
                menu['Remove local copy'] = (target) => { this.onClickRemoveSchema(target); };
            }

            if(item.sync.isRemote) {
                menu['Pull from remote'] = (target) => { this.onClickPullSchema(target); };
            }
        }

        return menu;
    }
}

module.exports = SchemaPane;
