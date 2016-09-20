'use strict';

let Pane = require('./Pane');

class FormsPane extends Pane {
    /**
     * Event: Click create new form
     */
    static onClickNewForm() {
        let navbar = ViewHelper.get('NavbarMain');

        apiCall('post', 'forms/new')
        .then((newContent) => {
            reloadResource('forms')
            .then(() => {
                navbar.reload();
                
                location.hash = '/forms/' + newForm.id;
            });
        })
        .catch(navbar.onError);
    }
    
    /**
     * Event: On click remove
     */
    static onClickDeleteForm() {
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

    static getRenderSettings() {
        return {
            label: 'Forms',
            route: '/forms/',
            icon: 'wpforms',
            items: resources.forms,

            // Sorting logic
            sort: function(item, queueItem) {
                queueItem.$element.attr('data-form-id', item.id);
               
                if(item.folder) {
                    queueItem.createDir = true;
                    queueItem.parentDirAttr = {'data-form-folder': item.folder };
                }
            },
            
            // Item context menu
            itemContextMenu: {
                'This form': '---',
                'Copy id': () => { this.onClickCopyItemId(); },
                'Cut': () => { this.onClickCutForm(); },
                'Delete': () => { this.onClickDeleteForm(); }
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
