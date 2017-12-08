'use strict';

const RequestHelper = require('Client/Helpers/RequestHelper');

const NavbarPane = require('./NavbarPane');
const NavbarMain = require('./NavbarMain');

/**
 * The Template navbar pane
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */
class TemplatePane extends NavbarPane {
    /**
     * Event: Click add Template
     */
    static onClickAddTemplate() {
        let newTemplate = new HashBrown.Models.Template({
            type: 'page',
            name: 'myTemplate.html'
        });

        UI.confirmModal(
            'add',
            'Add new template',
            [
                _.div({class: 'widget-group'}, 
                    _.label({class: 'widget widget--label'}, 'Type'),
                    new HashBrown.Views.Widgets.Dropdown({
                        options: [ 'page', 'partial' ],
                        value: newTemplate.type,
                        onChange: (newValue) => {
                            newTemplate.type = newValue;
                        }
                    }).$element
                ),
                _.div({class: 'widget-group'}, 
                    _.label({class: 'widget widget--label'}, 'Name'),
                    new HashBrown.Views.Widgets.Input({
                        placeholder: 'Template name',
                        value: newTemplate.name,
                        type: 'text',
                        onChange: (newValue) => {
                            newTemplate.name = newValue;
                        }
                    }).$element
                )
            ],
            () => {
                newTemplate.updateId();

                // Sanity check
                if(!newTemplate.type || !newTemplate.name || newTemplate.name.length < 2) { return false; }

                // Look for duplicate id
                for(let template of resources.templates) {
                    if(template.id == newTemplate.id && template.type == newTemplate.type) {
                        return UI.errorModal(new Error('A Template of type "' + template.type + '" and name "' + template.name + '" already exists'));
                    }
                }

                RequestHelper.request('post', 'templates/' + newTemplate.type + '/' + newTemplate.name, newTemplate)
                .then(() => {
                    return RequestHelper.reloadResource('templates');
                })
                .then(() => {
                    NavbarMain.reload();

                    location.hash = '/templates/' + newTemplate.type + '/' + newTemplate.id;
                })
                .catch(UI.errorModal);
            }
        );
    }
        
    /**
     * Event: On click remove Template
     */
    static onClickRemoveTemplate() {
        let $element = $('.context-menu-target'); 
        let id = $element.data('id');
        let type = $element.attr('href').replace('#/templates/', '').replace('/' + id, '');
        
        let model;

        for(let template of resources.templates) {
            if(template.id == id && template.type == type) {
                model = template;
            }
        }

        if(!model) {
            return UI.errorModal(new Error('Template of id "' + id + '" and type "' + type + '" was not found'));
        }
        
        UI.confirmModal('delete', 'Delete "' + model.name + '"', 'Are you sure you want to delete this template?', () => {
            RequestHelper.request('delete', 'templates/' + model.type + '/' + model.name)
            .then(() => {
                $element.parent().remove();

                return RequestHelper.reloadResource('templates');
            })
            .then(() => {
                NavbarMain.reload();
                
                // Cancel the TemplateEditor view if it was displaying the deleted Template
                if(location.hash == '#/templates/' + model.type + '/' + model.id) {
                    location.hash = '/templates/';
                }
            })
            .catch(UI.errorModal);
        });
    }

    /**
     * Event: On click rename Template
     */
    static onClickRenameTemplate() {
        let id = $('.context-menu-target').data('id');
        let type = $('.context-menu-target').parent().data('routing-path').split('/')[0];
        let model = HashBrown.Helpers.TemplateHelper.getTemplate(type, id);

        if(!model) {
            return UI.errorModal(new Error('Template of id "' + id + '" and type "' + type + '" was not found'));
        }

        let oldName = model.name;

        UI.confirmModal(
            'rename',
            'Rename "' + model.name + '"',
            _.div({class: 'widget-group'},
                _.label({class: 'widget widget--label'}, 'New name'),
                new HashBrown.Views.Widgets.Input({
                    value: model.name,
                    placeholder: 'Enter Template name',
                    onChange: (newValue) => {
                        model.name = newValue;
                    }
                }).$element
            ),
            () => {
                RequestHelper.request('post', 'templates/' + type + '/' + model.name + (oldName ? '?oldName=' + oldName : ''), model)
                .then((newTemplate) => {
                    return RequestHelper.reloadResource('templates');
                })
                .then(() => {
                    NavbarMain.reload();

                    // Go to new Template if TemplateEditor was showing the old one
                    let templateEditor = Crisp.View.get('TemplateEditor');

                    if(templateEditor && templateEditor.model.id == model.id) {
                        model.updateId();
                       
                        if(model.id == templateEditor.model.id) {
                            templateEditor.model = null;
                            templateEditor.fetch();
                        
                        } else { 
                            location.hash = '/templates/' + model.type + '/' + model.id;

                        }
                    }
                })
                .catch(UI.errorModal);
            }
        )
    }

    /**
     * Init
     */
    static init() {
        if(!currentUserHasScope('templates')) { return; }

        NavbarMain.addTabPane('/templates/', 'Templates', 'code', {
            getItems: () => { return resources.templates; },

            // Item path
            itemPath: function(item) {
                return item.type + '/' + item.id;
            },

            // Hierarchy logic
            hierarchy: function(item, queueItem) {
                queueItem.$element.attr('data-template-id', item.id);
                queueItem.$element.attr('data-remote', true);
               
                let rootDirName = item.type.substring(0, 1).toUpperCase() + item.type.substring(1) + 's';
                let parentDirName = item.parentId;

                if(!item.parentId) {
                    queueItem.createDir = true;

                    parentDirName = item.folder ? rootDirName + '/' + item.folder : rootDirName;
                }

                queueItem.parentDirAttr = {'data-template-id': parentDirName };
                queueItem.parentDirExtraAttr = { 'data-remote': true };
            },

            // Item context menu
            itemContextMenu: {
                'This template': '---',
                'Open in new tab': () => { this.onClickOpenInNewTab(); },
                'Rename': () => { this.onClickRenameTemplate(); },
                'Remove': () => { this.onClickRemoveTemplate(); },
                'Copy id': () => { this.onClickCopyItemId(); },
                'General': '---',
                'Add template': () => { this.onClickAddTemplate(); },
                'Refresh': () => { this.onClickRefreshResource('templates'); }
            },

            // General context menu
            paneContextMenu: {
                'Templates': '---',
                'Add template': () => { this.onClickAddTemplate(); },
                'Refresh': () => { this.onClickRefreshResource('templates'); }
            }
        });
    }
}

module.exports = TemplatePane;
