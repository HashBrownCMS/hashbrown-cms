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
            '/${category}/${id}/${tab}': {
                handler: this.resource
            },
            '/${category}/${id}': {
                handler: this.resource
            },
            '/${category}': {
                handler: this.resources
            }
        };
    }

    /**
     * Shows a single resource in the editor
     */
    static async resource(request, params) {
        return [
            this.getPanel(params.category, params.id),
            this.getEditor(params.category, params.id, params.tab)
        ];
    }

    /**
     * Lists all resources in the panel
     */
    static async resources(request, params) {
        return [
            this.getPanel(params.category),
            this.getEditor(params.category, 'overview')
        ];
    }

    /**
     * Gets the editor for a category
     *
     * @param {String} category
     * @param {String} id
     * @param {String} tab
     *
     * @return {HashBrown.Entity.View.ResourceEditor.ResourceEditorBase} Editor
     */
    static getEditor(category, id = '', tab = '') {
        checkParam(category, 'category', String, true);
        checkParam(id, 'id', String);
        checkParam(tab, 'tab', String);
       
        if(tab === 'json') {
            return HashBrown.Entity.View.ResourceEditor.JsonEditor.new({
                state: {
                    category: category,
                    id: id
                }
            });
        }

        for(let name in HashBrown.Entity.View.ResourceEditor) {
            let type = HashBrown.Entity.View.ResourceEditor[name];

            if(type.category !== category) { continue; }

            return type.new({
                state: {
                    category: category,
                    id: id,
                    tab: tab
                }
            });
        }

        throw new Error(`No resource editor for category "${category}" was found`);
    }

    /**
     * Gets the panel for a category
     *
     * @param {String} category
     * @param {String} id
     *
     * @return {HashBrown.Entity.View.Panel.PanelBase} Panel
     */
    static getPanel(category, id = '') {
        checkParam(category, 'category', String, true);
        checkParam(id, 'id', String);
        
        for(let name in HashBrown.Entity.View.Panel) {
            let type = HashBrown.Entity.View.Panel[name];

            if(type.category !== category) { continue; }

            return type.new({
                state: {
                    category: category,
                    id: id
                }
            });
        }

        throw new Error(`No panel for category "${category}" was found`);
    }
}

module.exports = ResourceController;
