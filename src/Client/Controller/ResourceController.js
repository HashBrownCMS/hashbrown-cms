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
            '/${library}/${id}/${tab}': {
                handler: this.resource
            },
            '/${library}/${id}': {
                handler: this.resource
            },
            '/${library}': {
                handler: this.resources
            }
        };
    }

    /**
     * Shows a single resource in the editor
     */
    static async resource(request, params) {
        return [
            this.getPanel(params.library, params.id),
            this.getEditor(params.library, params.id, params.tab)
        ];
    }

    /**
     * Lists all resources in the panel
     */
    static async resources(request, params) {
        return [
            this.getPanel(params.library),
            this.getEditor(params.library, 'overview')
        ];
    }

    /**
     * Gets the editor for a library
     *
     * @param {String} library
     * @param {String} id
     * @param {String} tab
     *
     * @return {HashBrown.Entity.View.ResourceEditor.ResourceEditorBase} Editor
     */
    static getEditor(library, id = '', tab = '') {
        checkParam(library, 'library', String, true);
        checkParam(id, 'id', String);
        checkParam(tab, 'tab', String);
       
        if(tab === 'json') {
            return HashBrown.Entity.View.ResourceEditor.JsonEditor.new({
                state: {
                    library: library,
                    id: id
                }
            });
        }

        let type = HashBrown.Service.LibraryService.getClass(library, HashBrown.Entity.View.ResourceEditor.ResourceEditorBase);

        if(!type) {
            throw new Error(`No resource editor for library "${library}" was found`);
        }

        return type.new({
            state: {
                id: id,
                tab: tab
            }
        });
    }

    /**
     * Gets the panel for a library
     *
     * @param {String} library
     * @param {String} id
     *
     * @return {HashBrown.Entity.View.Panel.PanelBase} Panel
     */
    static getPanel(library, id = '') {
        checkParam(library, 'library', String, true);
        checkParam(id, 'id', String);
        
        let type = HashBrown.Service.LibraryService.getClass(library, HashBrown.Entity.View.Panel.PanelBase);
        
        if(!type) {
            throw new Error(`No panel for library "${library}" was found`);
        }

        return type.new({
            state: {
                id: id
            }
        });
    }
}

module.exports = ResourceController;
