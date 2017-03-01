'use strict';

let Pane = require('./Pane');

class FormsPane extends Pane {
    /**
     * Event: Click create new form
     */
    static onClickNewForm() {
        let navbar = ViewHelper.get('NavbarMain');

        apiCall('post', 'forms/new')
        .then((newFormId) => {
            reloadResource('forms')
            .then(() => {
                navbar.reload();
                
                location.hash = '/forms/' + newFormId;
            });
        })
        .catch(navbar.onError);
    }
    
    /**
     * Event: On click remove
     */
    static onClickRemoveForm() {
        let view = this;
        let id = $('.context-menu-target-element').data('id');
        let form = resources.forms.filter((form) => { return form.id == id; })[0];

        function onSuccess() {
            debug.log('Removed Form with id "' + form.id + '"', view); 
        
            return reloadResource('forms')
            .then(function() {
                ViewHelper.get('NavbarMain').reload();
                
                // Cancel the FormEditor view
                location.hash = '/forms/';
            });
        }

        function onError(err) {
            new MessageModal({
                model: {
                    title: 'Error',
                    body: err.message
                }
            });
        }

        new MessageModal({
            model: {
                title: 'Delete form',
                body: 'Are you sure you want to delete the form "' + form.title + '"?'
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default',
                    callback: () => {
                    }
                },
                {
                    label: 'Delete',
                    class: 'btn-danger',
                    callback: () => {
                        apiCall('delete', 'forms/' + form.id)
                        .then(onSuccess)
                        .catch(onError);
                    }
                }
            ]
        });
    }
    
    /**
     * Event: Click pull Form
     */
    static onClickPullForm() {
        let navbar = ViewHelper.get('NavbarMain');
        let formEditor = ViewHelper.get('FormEditor');
        let pullId = $('.context-menu-target-element').data('id');

        // API call to pull the Form by id
        apiCall('post', 'forms/pull/' + pullId, {})
        
        // Upon success, reload all Form models    
        .then(() => {
            return reloadResource('forms');
        })

        // Reload the UI
        .then(() => {
            navbar.reload();

            if(formEditor && formEditor.model.id == pullId) {
                formEditor.model = null;
                formEditor.fetch();
            }
        }) 
        .catch(UI.errorModal);
    }
    
    /**
     * Event: Click push Form
     */
    static onClickPushForm() {
        let navbar = ViewHelper.get('NavbarMain');
        let pushId = $('.context-menu-target-element').data('id');
        let formEditor = ViewHelper.get('FormEditor');

        // API call to push the Content by id
        apiCall('post', 'forms/push/' + pushId)

        // Upon success, reload all Content models
        .then(() => {
            return reloadResource('forms');
        })

        // Reload the UI
        .then(() => {
            navbar.reload();

            if(formEditor && formEditor.model.id == pushId) {
                formEditor.model = null;
                formEditor.fetch();
            }
        }) 
        .catch(UI.errorModal);
    }

    static getRenderSettings() {
        return {
            label: 'Forms',
            route: '/forms/',
            icon: 'wpforms',
            items: resources.forms,

            // Hierarchy logic
            hierarchy: function(item, queueItem) {
                queueItem.$element.attr('data-form-id', item.id);
               
                if(item.folder) {
                    queueItem.createDir = true;
                    queueItem.parentDirAttr = {'data-form-folder': item.folder };
                }
            },
            
            // Item context menu
            getItemContextMenu: (item) => {
                let menu = {};
                
                menu['This form'] = '---';
                menu['Copy'] = () => { this.onClickCopyForm(); };
                menu['Copy id'] = () => { this.onClickCopyItemId(); };

                if(!item.local && !item.remote && !item.locked) {
                    menu['Remove'] = () => { this.onClickRemoveForm(); };
                }

                if(item.local || item.remote) {
                    menu['Sync'] = '---';
                }

                if(item.local) {
                    menu['Push to remote'] = () => { this.onClickPushForm(); };
                    menu['Remove local copy'] = () => { this.onClickRemoveForm(); };
                }
                
                if(item.remote) {
                    menu['Pull from remote'] = () => { this.onClickPullForm(); };
                }

                return menu;
            },
            
            // General context menu
            paneContextMenu: {
                'Forms': '---',
                'New form': () => { this.onClickNewForm(); },
                'Paste': () => { this.onClickPasteForm(); }
            }
        };
    }
}

module.exports = FormsPane;
