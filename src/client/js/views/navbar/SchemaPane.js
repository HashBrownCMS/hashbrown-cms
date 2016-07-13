'use strict';

let Pane = require('./Pane');

class SchemaPane extends Pane {
    /**
     * Event: Click remove schema
     */
    static onClickRemoveSchema() {
        let navbar = ViewHelper.get('NavbarMain');
        let id = $('.context-menu-target-element').data('id');
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
     * Gets the render settings
     *
     * @returns {Object} settings
     */
    static getRenderSettings() {
        return {
            label: 'Schemas',
            route: '/schemas/',
            icon: 'gears',
            items: resources.schemas,

            // Item context menu
            itemContextMenu: {
                'This schema': '---',
                'New child schema': () => { this.onClickNewSchema(); },
                'Copy id': () => { this.onClickCopyItemId(); },
                'Remove': () => { this.onClickRemoveSchema(); }
            },

            // Sorting logic
            sort: function(item, queueItem) {
                queueItem.$element.attr('data-schema-id', item.id);
               
                if(item.parentSchemaId) {
                    queueItem.parentDirAttr = {'data-schema-id': item.parentSchemaId };

                } else {
                    queueItem.parentDirAttr = {'data-schema-type': item.type};
                }
            }
        };
    }
}

module.exports = SchemaPane;
