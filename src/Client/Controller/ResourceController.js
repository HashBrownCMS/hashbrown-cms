'use strict';

/**
 * The controller for resources
 */
class ResourceController extends HashBrown.Controller.ControllerBase {
    /**
     * Routes
     *
     * @return {Object} Routes
     */
    static get routes() {
        return {
            '/': {
                redirect: '/content'
            },
            '/${module}/${id}/${tab}': {
                handler: this.resource
            },
            '/${module}/${id}': {
                handler: this.resource
            },
            '/${module}': {
                handler: this.resources
            }
        };
    }

    /**
     * Shows a single resource in the editor
     */
    static async resource(request, params) {
        return [
            this.getPanel(params.module, params.id),
            this.getEditor(params.module, params.id, params.tab)
        ];
    }

    /**
     * Lists all resources in the panel
     */
    static async resources(request, params) {
        return [
            this.getPanel(params.module),
            this.getEditor(params.module, 'overview')
        ];
    }

    /**
     * Gets the editor for a module
     *
     * @param {String} module
     * @param {String} id
     * @param {String} tab
     *
     * @return {HashBrown.Entity.View.ResourceEditor.ResourceEditorBase} Editor
     */
    static getEditor(module, id = '', tab = '') {
        checkParam(module, 'module', String, true);
        checkParam(id, 'id', String);
        checkParam(tab, 'tab', String);
       
        if(tab === 'json') {
            return HashBrown.Entity.View.ResourceEditor.JsonEditor.new({
                state: {
                    module: module,
                    id: id
                }
            });
        }

        let type = HashBrown.Service.ModuleService.getClass(module, HashBrown.Entity.View.ResourceEditor.ResourceEditorBase);

        if(!type) {
            throw new Error(`No resource editor for module "${module}" was found`);
        }

        return type.new({
            state: {
                id: id,
                tab: tab
            }
        });
    }

    /**
     * Gets the panel for a module
     *
     * @param {String} module
     * @param {String} id
     *
     * @return {HashBrown.Entity.View.Panel.PanelBase} Panel
     */
    static getPanel(module, id = '') {
        checkParam(module, 'module', String, true);
        checkParam(id, 'id', String);
        
        let type = HashBrown.Service.ModuleService.getClass(module, HashBrown.Entity.View.Panel.PanelBase);
        
        if(!type) {
            throw new Error(`No panel for module "${module}" was found`);
        }

        return type.new({
            state: {
                id: id
            }
        });
    }
}

module.exports = ResourceController;
