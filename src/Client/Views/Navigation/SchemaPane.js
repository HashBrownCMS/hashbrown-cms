'use strict';

/**
 * The Schema navbar pane
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */
class SchemaPane extends HashBrown.Views.Navigation.NavbarPane {
    static get route() { return '/schemas/'; }
    static get label() { return 'Schemas'; }
    static get icon() { return 'gears'; }
    
    /**
     * Event: Click remove schema
     */
    static onClickRemoveSchema() {
        let $element = $('.context-menu-target'); 
        let id = $element.data('id');
        let schema = HashBrown.Helpers.SchemaHelper.getSchemaByIdSync(id);
        
        if(!schema.isLocked) {
            UI.confirmModal(
                'delete',
                'Delete schema',
                'Are you sure you want to delete the schema "' + schema.name + '"?',
                async () => {
                    await HashBrown.Helpers.ResourceHelper.remove('schemas', id);

                    debug.log('Removed schema with id "' + id + '"', this); 

                    // Cancel the SchemaEditor view if it was displaying the deleted content
                    if(location.hash == '#/schemas/' + id) {
                        location.hash = '/schemas/';
                    }
                }
            );
        } else {
            UI.messageModal(
                'Delete schema',
                'The schema "' + schema.name + '" is locked and cannot be removed'
            );
        }
    }

    /**
     * Event: Click new Schema
     */
    static async onClickNewSchema() {
        let parentId = $('.context-menu-target').data('id');

        let newSchema = await HashBrown.Helpers.ResourceHelper.new('schemas', '?parentSchemaId=' + parentId);

        location.hash = '/schemas/' + newSchema.id;
    }
    
    /**
     * Event: Click pull Schema
     */
    static async onClickPullSchema() {
        let schemaEditor = Crisp.View.get('SchemaEditor');
        let pullId = $('.context-menu-target').data('id');

        await HashBrown.Helpers.ResourceHelper.pull('schemas', pullId);
           
        location.hash = '/schemas/' + pullId;
		
        let editor = Crisp.View.get('SchemaEditor');

        if(editor && editor.model.id == pullId) {
            editor.model = null;
            editor.fetch();
        }
    }
    
    /**
     * Event: Click push Schema
     */
    static async onClickPushSchema() {
		let $element = $('.context-menu-target');
        let pushId = $element.data('id');

		$element.parent().addClass('loading');

        await HashBrown.Helpers.ResourceHelper.push('schemas', pushId);
    }

    /**
     * Gets all items
     *
     * @returns {Promise} Items
     */
    static async getItems() {
        return await HashBrown.Helpers.SchemaHelper.getAllSchemas();
    }

    /**
     * Item context menu
     */
    static getItemContextMenu(item) {
        let menu = {};
        let isSyncEnabled = HashBrown.Context.projectSettings.sync.enabled;

        menu['This schema'] = '---';
        
        menu['Open in new tab'] = () => { this.onClickOpenInNewTab(); };
       
        menu['New child schema'] = () => { this.onClickNewSchema(); };
        
        if(!item.sync.hasRemote && !item.sync.isRemote && !item.isLocked) {
            menu['Remove'] = () => { this.onClickRemoveSchema(); };
        }
        
        menu['Copy id'] = () => { this.onClickCopyItemId(); };
        
        if(item.isLocked && !item.sync.isRemote) { isSyncEnabled = false; }

        if(isSyncEnabled) {
            menu['Sync'] = '---';
            
            if(!item.sync.isRemote) {
                menu['Push to remote'] = () => { this.onClickPushSchema(); };
            }

            if(item.sync.hasRemote) {
                menu['Remove local copy'] = () => { this.onClickRemoveSchema(); };
            }

            if(item.sync.isRemote) {
                menu['Pull from remote'] = () => { this.onClickPullSchema(); };
            }
        }

        menu['General'] = '---';
        menu['Refresh'] = () => { this.onClickRefreshResource('schemas'); };

        return menu;
    }
    
    /**
     * Set general context menu items
     */
    static getPaneContextMenu() {
        return {
            'Schemas': '---',
            'Refresh': () => { this.onClickRefreshResource('schemas'); }
        };
    }

    /**
     * Hierarchy logic
     */
    static hierarchy(item, queueItem) {
        queueItem.$element.attr('data-schema-id', item.id);
      
        if(item.parentSchemaId) {
            queueItem.parentDirAttr = {'data-schema-id': item.parentSchemaId };

        } else {
            queueItem.parentDirAttr = {'data-schema-type': item.type};
        }
    }
}

module.exports = SchemaPane;
