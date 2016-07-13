'use strict';

let Pane = require('./Pane');

class FormsPane extends Pane {
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
                'Remove': () => { this.onClickRemoveForm(); }
            },

            // Dir context menu
            dirContextMenu: {
                'Directory': '---',
                'Paste': () => { this.onClickPasteForm(); },
                'New folder': () => { this.onClickNewFormDirectory(); },
                'New form': () => { this.onClickNewForm(); },
                'Remove': () => { this.onClickRemoveFormDirectory(); }
            },

            // General context menu
            paneContextMenu: {
                'General': '---',
                'Paste': () => { this.onClickPasteForm(); },
                'New folder': () => { this.onClickNewFormDirectory(); },
                'New form': () => { this.onClickNewForm(); }
            }
        };
    }
}

module.exports = FormsPane;
