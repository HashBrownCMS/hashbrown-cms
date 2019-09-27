'use strict';

const HEARTBEAT_INTERVAL  = 1000 * 60; // 1 minute between each heartbeat
const HEARTBEAT_TIMEOUT  = 1000 * 5; // An extra 5 seconds waiting time when checking for last heartbeat

/**
 * The base class for resource editors
 *
 * @memberof HashBrown.Client.Entity.View.ResourceEditor
 */
class ResourceEditorBase extends HashBrown.Entity.View.ViewBase {
    static get category() { return this.name.replace('Editor', '').toLowerCase(); }
    static get itemType() { return null; }

    get category() { return this.constructor.category; }
    get itemType() { return this.constructor.itemType; }

    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(Boolean, 'isDirty', false);
    }

    /**
     * Gets the placeholder
     *
     * @return {HTMLElement} Placeholder
     */
    getPlaceholder() {
        let element = document.createElement('div');
        element.className = 'resource-editor';

        let header = document.createElement('div');
        header.className = 'resource-editor__header';
        element.appendChild(header);
        
        let body = document.createElement('div');
        body.className = 'resource-editor__body';
        element.appendChild(body);

        let footer = document.createElement('div');
        footer.className = 'resource-editor__footer';
        element.appendChild(footer);

        return element;
    }
    
    /**
     * Checks whether this resource is currently being edited by someone else, and displays a warning if it is
     */
    editedCheck() {
        // The check succeeded, just start the heartbeat
        if(!this.model || !this.model.viewedBy || !this.model.viewedOn || this.model.viewedBy === HashBrown.Context.user.id || new Date() - this.model.viewedOn > HEARTBEAT_INTERVAL + HEARTBEAT_TIMEOUT) {
            this.onHeartbeat();
        
        // The check failed, ask the user if they want to proceed
        } else {
            let modal = UI.confirm('Resource busy', `"${this.state.title}" is currently being edited by someone else. Do you still want to proceed?`);

            modal.on('yes', () => {
                this.onHeartbeat();
            });

            modal.on('no', () => {
                location.hash = '/' + this.category + '/';
            });
        }
    }
    
    /**
     * Event: Heartbeat
     */
    async onHeartbeat() {
        if(typeof this === 'undefined' || !this || !this.model || Object.keys(this.model).length < 1 || !this.element || !this.element.parentElement) { return; }

        try {
            await HashBrown.Service.ResourceService.heartbeat(this.model);

        } catch(e) {
            UI.error(e);

        } finally {
            setTimeout(() => {
                this.onHeartbeat();
            }, HEARTBEAT_INTERVAL);

        }
    }

    /**
     * Event: Click save
     */
    async onClickSave() {
        await HashBrown.Service.ResourceService.set(this.category, this.state.id, this.model);

        UI.notifySmall(`"${this.state.title}" saved successfully`, null, 3);

        await this.update();
    }

    /**
     * Init
     */
    async init() {
        await super.init();

        this.editedCheck();
    }

    /**
     * Fetches the model
     */
    async fetch() {
        this.state.category = HashBrown.Service.NavigationService.getRoute(0);
        this.state.id = HashBrown.Service.NavigationService.getRoute(1);

        if(!this.state.id) {
            this.state.name = 'welcome';
                    
        } else {
            this.state.name = undefined;
            
            this.model = await HashBrown.Service.ResourceService.get(this.itemType, this.category, this.state.id);
        
        }
    }
    
    /**
     * Update
     */
    async update() {
        // Cache scroll position
        let scrollTop = 0;

        if(this.namedElements.body) {
            scrollTop = this.namedElements.body.scrollTop;
        }

        // Cache field states
        let fieldStates = {};

        for(let field of this.state.fields || []) {
            fieldStates[field.model.key] = field.state;
        }

        await super.update();        
      
        // Restore field states
        for(let field of this.state.fields || []) {
            let state = fieldStates[field.model.key];

            if(!state) { continue; }

            field.state.isCollapsed = state.isCollapsed;
            field.render();
        }

        // Restore scroll position
        if(this.namedElements.body) {
            this.namedElements.body.scrollTop = scrollTop;
        }
    }
}

module.exports = ResourceEditorBase;
