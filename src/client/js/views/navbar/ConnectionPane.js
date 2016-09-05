'use strict';

let Pane = require('./Pane');

class ConnectionPane extends Pane {
    /**
     * Event: Click new connection
     */
    static onClickNewConnection() {
        let navbar = ViewHelper.get('NavbarMain');

        apiCall('post', 'connections/new')
        .then((newConnection) => {
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
        let id = $('.context-menu-target-element').data('id');
        let name = $('.context-menu-target-element').data('name');
        
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
                        .catch(navbar.onError);
                    }
                }
            ]
        });
    }

    /**
     * Renders the toolbar
     *
     * @returns {HTMLElement} The toolbar element
     */
    static renderToolbar() {
        let $mediaProvider;
        let $templateProvider;

        function onChangeMediaProvider() {
            ConnectionHelper.setMediaProvider($(this).val())
            .then(() => {
                return reloadResource('media');
            })
            .then(() => {
                ViewHelper.get('NavbarMain').reload();
            })
            .catch(errorModal);
        }

        function onChangeTemplateProvider() {
            ConnectionHelper.setTemplateProvider($(this).val())
            .then(() => {
                return reloadResource('templates');
            })
            .then(() => {
                return reloadResource('sectionTemplates');
            })
            .then(() => {
                ViewHelper.get('NavbarMain').reload();
            })
            .catch(errorModal);
        }

        let $toolbar = _.div({class: 'pane-toolbar'},
            _.div({},
                _.label('Media provider'),
                $mediaProvider = _.select({},
                    _.option({value: null}, '(none)'),
                    _.each(resources.connections, (i, connection) => {
                        return _.option({value: connection.id},
                            connection.title
                        );
                    })
                ).change(onChangeMediaProvider)
            ),
            _.div({},
                _.label('Template provider'),
                $templateProvider = _.select({},
                    _.option({value: null}, '(none)'),
                    _.each(resources.connections, (i, connection) => {
                        return _.option({value: connection.id},
                            connection.title
                        );
                    })
                ).change(onChangeTemplateProvider)
            )
        );
        
        ConnectionHelper.getMediaProvider()
        .then((connection) => {
            $mediaProvider.val(connection.id);

            return ConnectionHelper.getTemplateProvider();
        })
        .then((connection) => {
            $templateProvider.val(connection.id);
        })
        .catch((e) => {
            debug.log(e.message, this);
        });


        return $toolbar;
    }

    /**
     * Gets render settings
     *
     * @returns {Object} settings
     */
    static getRenderSettings() {
        return {
            label: 'Connections',
            route: '/connections/',
            icon: 'exchange',
            items: resources.connections,
            toolbar: this.renderToolbar(),

            // Item context menu
            itemContextMenu: {
                'This connection': '---',
                'Copy id': () => { this.onClickCopyItemId(); },
                'Remove': () => { this.onClickRemoveConnection(); }
            },

            // General context menu
            paneContextMenu: {
                'General': '---',
                'New connection': () => { this.onClickNewConnection(); }
            }
        };
    }
}

module.exports = ConnectionPane;
