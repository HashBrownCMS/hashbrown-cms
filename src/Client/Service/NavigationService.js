'use strict';

/**
 * The service helper for route handling
 *
 * @memberof HashBrown.Client.Service
 */
class NavigationService {
    /**
     * Start listening for route changes
     */
    static startListening() {
        window.addEventListener('hashchange', (e) => this.onChangeRoute(e)); 
       
        this.onChangeRoute();
       
        this.initBrowserSpace();
        this.initMenuSpace();
    }

    /**
     * Event: Route changed
     *
     * @param {HashChangeEvent} e
     */
    static onChangeRoute(e) {
        HashBrown.Service.EventService.trigger('route');
        
        if(this.skipRoute) {
            this.skipRoute = false;
            return;
        }

        let category = this.getRoute(0);

        if(!category) { return location.hash = '/content/'; }

        let hasScope = HashBrown.Context.user.hasScope(HashBrown.Context.project.id, category);
        
        if(!hasScope) { return location.hash = '/content/'; }
   
        document.body.classList.toggle('welcome', !this.getRoute(1));

        this.updateEditorSpace(e);
    }
   
    /**
     * Manually dispatches a hash change event
     */
    static poke() {
        window.dispatchEvent(new HashChangeEvent('hashchange'));
    }

    /**
     * Updates the editor space with the appropriate welcome screen or resource editor
     *
     * @param {HashChangeEvent} e
     */
    static updateEditorSpace(e) {
        if(HashBrown.Context.currentResourceEditor && HashBrown.Context.currentResourceEditor.isDirty) {
            e.preventDefault();

            UI.highlight(false);

            UI.confirm(
                'Discard unsaved changes?',
                'You have unsaved changes. Do you want to discard them?',
                () => {
                    HashBrown.Context.currentResourceEditor = null;
                    this.poke();
                },
                () => {
                    this.skipRoute = true;
                    location = e.oldURL;
                }
            );

            return;
        }

        HashBrown.Context.currentResourceEditor = null;
        
        let category = this.getRoute(0);
        let resourceId = this.getRoute(1);
        let isJson = this.getRoute(2) === 'json';

        let space = document.querySelector('.page--environment__space--editor');

        space.innerHTML = '';

        HashBrown.Context.currentResourceEditor = null;

        if(isJson) {
            HashBrown.Context.currentResourceEditor = HashBrown.Entity.View.ResourceEditor.JsonEditor.new();

        } else {
            for(let name in HashBrown.Entity.View.ResourceEditor) {
                let type = HashBrown.Entity.View.ResourceEditor[name];

                if(type === HashBrown.Entity.View.ResourceEditor.JsonEditor) { continue; }
                if(type.category !== category) { continue; }

                HashBrown.Context.currentResourceEditor = type.new();
                break;
            }
        }

        if(!HashBrown.Context.currentResourceEditor) {
            space.innerHTML = `No resource editor for category "${category}" was found`;
            return;
        }

        space.appendChild(
            HashBrown.Context.currentResourceEditor.element
        );
    }

    /**
     * Updates the browser space (the panel on the left)
     */
    static initBrowserSpace() {
        let space = document.querySelector('.page--environment__space--nav');

        space.innerHTML = '';

        space.appendChild(
            HashBrown.Entity.View.Navigation.ResourceBrowser.new().element
        );
    }

    /**
     * Updates the menu space (menu on the top right)
     */
    static initMenuSpace() {
        let space = document.querySelector('.page--environment__space--menu');

        space.innerHTML = '';

        space.appendChild(
            HashBrown.Entity.View.Navigation.Session.new().element
        );
    }

    /**
     * Gets a URL query parameter
     *
     * @param {String} name
     * @param {String} string
     *
     * @return {String} Value
     */
    static getQuery(name, string) {
        if(!string) { string = location.search; }

        return new URLSearchParams(string).get(name);
    }

    /**
     * Gets part of the hash route
     *
     * @param {Number} index 
     *
     * @return {String} Path
     */
    static getRoute(index) {
        checkParam(index, 'index', Number);

        let route = location.hash
            .split('/')
            .filter((x) => x && x !== '#');

        return route[index];
    }
}

module.exports = NavigationService;
