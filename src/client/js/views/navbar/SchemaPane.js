'use strict';

class SchemaPane extends NavbarPane {
    /**
     * Event: Click remove schema
     */
    static onClickRemoveSchema() {
        let navbar = ViewHelper.get('NavbarMain');
        let $element = $('.context-menu-target-element'); 
        let id = $element.data('id');
        let schema = window.resources.schemas[id];
        
        function onSuccess() {
            debug.log('Removed schema with id "' + id + '"', navbar); 
            
            reloadResource('schemas')
            .then(function() {
                navbar.reload();
                
                // Cancel the SchemaEditor view if it was displaying the deleted content
                if(location.hash == '#/schemas/' + id) {
                    location.hash = '/schemas/';
                }
            });
        }

        if(!schema.locked) {
            new MessageModal({
                model: {
                    title: 'Delete schema',
                    body: 'Are you sure you want to delete the schema "' + schema.name + '"?'
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
                            apiCall('delete', 'schemas/' + id)
                            .then(onSuccess)
                            .catch(navbar.onError);
                        }
                    }
                ]
            });
        } else {
            new MessageModal({
                model: {
                    title: 'Delete schema',
                    body: 'The schema "' + schema.name + '" is locked and cannot be removed'
                },
                buttons: [
                    {
                        label: 'OK',
                        class: 'btn-default',
                        callback: function() {
                        }
                    }
                ]
            });
        }
    }

    /**
     * Event: Click new schema
     */
    static onClickNewSchema() {
        let navbar = ViewHelper.get('NavbarMain');
        let parentId = $('.context-menu-target-element').data('id');
        let parentSchema = window.resources.schemas[parentId];

        apiCall('post', 'schemas/new', parentSchema)
        .then((newSchema) => {
            reloadResource('schemas')
            .then(() => {
                navbar.reload();

                location.hash = '/schemas/' + newSchema.id;
            });
        })
        .catch(navbar.onError);
    }
    
    /**
     * Event: Click pull Schema
     */
    static onClickPullSchema() {
        let navbar = ViewHelper.get('NavbarMain');
        let schemaEditor = ViewHelper.get('SchemaEditor');
        let pullId = $('.context-menu-target-element').data('id');

        apiCall('post', 'schemas/pull/' + pullId, {})
        .then(() => {
            return reloadResource('schemas');
        })
        .then(() => {
            navbar.reload();
           
			location.hash = '/schemas/' + pullId;
		
			let editor = ViewHelper.get('SchemaEditor');

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
		let $element = $('.context-menu-target-element');
        let pushId = $element.data('id');

		$element.parent().addClass('loading');

        apiCall('post', 'schemas/push/' + pushId)
        .then(() => {
            return reloadResource('schemas');
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
        NavbarMain.addTabPane('/schemas/', 'Schemas', 'gears', {
            getItems: () => { return resources.schemas; },

            // Item context menu
            getItemContextMenu: (item) => {
                let menu = {};
                let isSyncEnabled = SettingsHelper.getCachedSettings('sync').enabled == true;

                menu['This schema'] = '---';
                menu['New child schema'] = () => { this.onClickNewSchema(); };
                menu['Copy id'] = () => { this.onClickCopyItemId(); };
                
                if(!item.local && !item.remote && !item.locked) {
                    menu['Remove'] = () => { this.onClickRemoveSchema(); };
                }
                
                if(item.locked && !item.remote) { isSyncEnabled = false; }

                if(isSyncEnabled) {
                    menu['Sync'] = '---';
                    
                    if(!item.remote) {
                        menu['Push to remote'] = () => { this.onClickPushSchema(); };
                    }

                    if(item.local) {
                        menu['Remove local copy'] = () => { this.onClickRemoveSchema(); };
                    }

                    if(item.remote) {
                        menu['Pull from remote'] = () => { this.onClickPullSchema(); };
                    }
                }

                return menu;
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
