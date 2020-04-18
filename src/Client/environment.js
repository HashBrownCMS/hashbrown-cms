'use strict';

/**
 * @namespace HashBrown.Client
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Service shortcuts
    window.debug = HashBrown.Service.DebugService;
    window.UI = HashBrown.Service.UIService;

    // Error handling
    window.addEventListener('error', (e) => { UI.error(e); });
   
    // Set context variables
    HashBrown.Client.context = new HashBrown.Entity.Context(HashBrown.Client.context);
    HashBrown.Client.language = localStorage.getItem('language');

    let languages = HashBrown.Client.context.project.settings.languages;

    if(languages.indexOf(HashBrown.Client.language) < 0) {
        HashBrown.Client.language = languages[0];
    }

    /**
     * Populates spaces
     *
     * @param {String} space
     * @param {HashBrown.Entity.View.ViewBase} view
     */
    function setSpaceView(space, view) {
        checkParam(space, 'space', String, true);
        checkParam(view, 'view', HashBrown.Entity.View.ViewBase);

        let container = document.querySelector(`.page--environment__space--${space}`);
        container.innerHTML = '';
        
        HashBrown.Client[space] = view;

        if(!view || !view.element) { return; }

        container.appendChild(view.element);
    }

    /**
     * Handles events as requests
     *
     * @param {HashChangeEvent} request
     */
    async function handle(request) {
        checkParam(request, 'request', HashChangeEvent, true);

        if(HashBrown.Client.skipRouter) {
            delete HashBrown.Client.skipRouter;
            return;
        }

        // Await confirmation
        if(HashBrown.Client.editor && HashBrown.Client.editor.isDirty) {
            request.preventDefault();

            return await new Promise((resolve) => {
                UI.highlight(false);

                UI.confirm(
                    'Discard unsaved changes?',
                    'You have unsaved changes. Do you want to discard them?',
                    () => {
                        HashBrown.Client.editor.isDirty = false;
                        window.dispatchEvent(new HashChangeEvent('hashchange'));
                    },
                    () => {
                        HashBrown.Client.skipRouter = true;
                        location = request.oldURL;
                    }
                );
            });
        }
        
        let response = null;
        
        for(let name in HashBrown.Controller) {
            let controller = HashBrown.Controller[name];

            let thisResponse = await controller.getResponse(request);

            if(!thisResponse) { continue; }

            response = thisResponse;
            break;
        }

        if(!response) { return; }

        if(!Array.isArray(response)) {
            response = [ response ];
        }

        for(let view of response) {
            // Swap out the editor
            if(view instanceof HashBrown.Entity.View.ResourceEditor.ResourceEditorBase) {
                setSpaceView('editor', view);
            
            // Swap out the panel
            } else if(view instanceof HashBrown.Entity.View.Panel.PanelBase) {
                HashBrown.Client.nav.setPanel(view);

            }
        }
    }

    window.addEventListener('hashchange', handle);
    window.dispatchEvent(new HashChangeEvent('hashchange'));

    // Init pervasive views
    setSpaceView('nav', HashBrown.Entity.View.Navigation.ResourceBrowser.new());
    setSpaceView('menu', HashBrown.Entity.View.Navigation.Session.new());

    // Check for updates
    updateCheck();
});
