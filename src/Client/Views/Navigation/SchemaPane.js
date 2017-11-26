'use strict';

const ProjectHelper = require('Client/Helpers/ProjectHelper');
const RequestHelper = require('Client/Helpers/RequestHelper');
const SchemaHelper = require('Client/Helpers/SchemaHelper');

const NavbarPane = require('./NavbarPane');
const NavbarMain = require('./NavbarMain');

/**
 * The Schema navbar pane
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */
class SchemaPane extends NavbarPane {
    /**
     * Event: Click remove schema
     */
    static onClickRemoveSchema() {
        let $element = $('.context-menu-target'); 
        let id = $element.data('id');
        let schema = SchemaHelper.getSchemaByIdSync(id);
        
        if(!schema.isLocked) {
            UI.confirmModal(
                'delete',
                'Delete schema',
                'Are you sure you want to delete the schema "' + schema.name + '"?',
                () => {
                    RequestHelper.request('delete', 'schemas/' + id)
                    .then(() => {
                        debug.log('Removed schema with id "' + id + '"', this); 

                        return RequestHelper.reloadResource('schemas');
                    })
                    .then(() => {
                        NavbarMain.reload();

                        // Cancel the SchemaEditor view if it was displaying the deleted content
                        if(location.hash == '#/schemas/' + id) {
                            location.hash = '/schemas/';
                        }
                    })
                    .catch(UI.errorModal);
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
     * Event: Click new schema
     */
    static onClickNewSchema() {
        let parentId = $('.context-menu-target').data('id');
        let parentSchema = SchemaHelper.getSchemaByIdSync(parentId);

        RequestHelper.request('post', 'schemas/new', parentSchema)
        .then((newSchema) => {
            return RequestHelper.reloadResource('schemas')
            .then(() => {
                NavbarMain.reload();

                location.hash = '/schemas/' + newSchema.id;
            });
        })
        .catch(UI.errorModal);
    }
    
    /**
     * Event: Click pull Schema
     */
    static onClickPullSchema() {
        let schemaEditor = Crisp.View.get('SchemaEditor');
        let pullId = $('.context-menu-target').data('id');

        RequestHelper.request('post', 'schemas/pull/' + pullId, {})
        .then(() => {
            return RequestHelper.reloadResource('schemas');
        })
        .then(() => {
            NavbarMain.reload();
           
			location.hash = '/schemas/' + pullId;
		
			let editor = Crisp.View.get('SchemaEditor');

			if(editor && editor.model.id == pullId) {
                editor.model = null;
				editor.fetch();
			}
        }) 
        .catch(UI.errorModal);
    }
    
    /**
     * Event: Click push Schema
     */
    static onClickPushSchema() {
		let $element = $('.context-menu-target');
        let pushId = $element.data('id');

		$element.parent().addClass('loading');

        RequestHelper.request('post', 'schemas/push/' + pushId)
        .then(() => {
            return RequestHelper.reloadResource('schemas');
        })
        .then(() => {
            NavbarMain.reload();
        }) 
        .catch(UI.errorModal);
    }

    /**
     * Init
     */
    static init() {
        if(!currentUserHasScope('schemas')) { return; }

        NavbarMain.addTabPane('/schemas/', 'Schemas', 'gears', {
            getItems: () => { return resources.schemas; },

            // Item context menu
            getItemContextMenu: (item) => {
                let menu = {};
                let isSyncEnabled = HashBrown.Helpers.SettingsHelper.getCachedSettings(ProjectHelper.currentProject, null, 'sync').enabled;

                menu['This schema'] = '---';
                
                menu['Open in new tab'] = () => { this.onClickOpenInNewTab(); };
               
                menu['Copy id'] = () => { this.onClickCopyItemId(); };
                
                menu['New child schema'] = () => { this.onClickNewSchema(); };
                
                if(!item.sync.hasRemote && !item.sync.isRemote && !item.isLocked) {
                    menu['Remove'] = () => { this.onClickRemoveSchema(); };
                }
                
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
            },
            
            // Set general context menu items
            paneContextMenu: {
                'Schemas': '---',
                'Refresh': () => { this.onClickRefreshResource('schemas'); }
            },

            // Hierarchy logic
            hierarchy: function(item, queueItem) {
                queueItem.$element.attr('data-schema-id', item.id);
              
                if(item.parentSchemaId) {
                    queueItem.parentDirAttr = {'data-schema-id': item.parentSchemaId };

                } else {
                    queueItem.parentDirAttr = {'data-schema-type': item.type};
                }
            }
        });
    }
}

module.exports = SchemaPane;
