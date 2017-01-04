'use strict';

let Pane = require('./Pane');

class TemplatePane extends Pane {
    /**
     * Event: Click add Template
     */
    static onClickAddTemplate() {
    }
        
    /**
     * Event: On click remove Template
     */
    static onClickRemoveTemplate() {
    }

    /**
     * Gets the render settings
     *
     * @returns {Object} Settings
     */
    static getRenderSettings() {
        let templateItems = [];

        for(let templateId of resources.templates) {
            templateItems[templateItems.length] = {
                id: templateId,
                name: templateId
            };
        }
        
        for(let templateId of resources.sectionTemplates) {
            templateItems[templateItems.length] = {
                id: templateId,
                name: templateId
            };
        }

        return {
            label: 'Templates',
            route: '/templates/',
            icon: 'code',
            items: templateItems,

            // Item context menu
            itemContextMenu: {
                'This template': '---',
                'Copy id': () => { this.onClickCopyItemId(); },
                'Remove': () => { this.onClickRemoveTemplate(); }
            },

            // General context menu
            paneContextMenu: {
                'Template': '---',
                'Add user': () => { this.onClickAddTemplate(); }
            }
        };
    }
}

module.exports = TemplatePane;
