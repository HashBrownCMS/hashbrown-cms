'use strict';

const HEARTBEAT_INTERVAL  = 1000 * 60; // 1 minute between each heartbeat
const HEARTBEAT_TIMEOUT  = 1000 * 5; // An extra 5 seconds waiting time when checking for last heartbeat

/**
 * The base for all resource editors
 */
class ResourceEditor extends HashBrown.View.Editor.Editor {
    constructor(params) {
        super(params);

        UI.spinner(this.element, true);

        HashBrown.Service.EventService.on('resource', 'editor', (id) => { this.onResourceChanged(id); });

        this.on('ready', () => {
            this.editedCheck();
        });
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
            let modal = UI.confirm('This resource is currently being edited by someone else. Do you still want to proceed?');

            modal.on('yes', () => {
                this.onHeartbeat();
            });

            modal.on('no', () => {
                location.hash = this.model.constructor.category;
            });
        }
    }

    /**
     * Event: Heartbeat
     */
    async onHeartbeat() {
        if(typeof this === 'undefined' || !this || !this.element || !this.element.parentElement) { return; }

        try {
            await HashBrown.Service.ResourceService.heartbeat(this.model);

        } catch(e) {
            UI.error(e);

        }

        setTimeout(() => {
            this.onHeartbeat();
        }, HEARTBEAT_INTERVAL);
    }

    /**
     * Event: Resource changed
     *
     * @param {String} id
     */
    onResourceChanged(id) {
        if(!id || id !== this.modelId) { return; }
    
        debug.log('Resource "' + id + '" changed, reloading...', this);
        
        this.update();
    }

    /**
     * Saves the scroll position
     */
    saveScrollPosition() {
        let editorBody = this.element.querySelector('.editor__body');

        if(!editorBody) { return; }

        this._scrollTopCache = editorBody.scrollTop; 
    }
    
    /**
     * Restores the scroll position
     */
    restoreScrollPosition() {
        if(!this._scrollTopCache) { return; }

        let editorBody = this.element.querySelector('.editor__body');

        if(!editorBody) { return; }

        editorBody.scrollTop = this._scrollTopCache; 
    }
    
    /**
     * Saves the collapsed fields states
     */
    saveCollapsibleFieldStates() {
        this._collapsibleFieldStatesCache = [];
        
        let firstCollapsibleField = this.element.querySelector('.editor__field .collapsible');

        if(!firstCollapsibleField) { return; }

        for(let collapsibleField of firstCollapsibleField.parentElement.children) {
            if(!collapsibleField.classList.contains('collapsible')) { continue; }

            this._collapsibleFieldStatesCache.push(collapsibleField.classList.contains('collapsed'));
        }
    }
    
    /**
     * Restores the collapsed fields states
     */
    restoreCollapsibleFieldStates() {
        let firstCollapsibleField = this.element.querySelector('.editor__field .collapsible');

        if(!firstCollapsibleField) { return; }
        
        for(let collapsibleField of firstCollapsibleField.parentElement.children) {
            if(!collapsibleField.classList.contains('collapsible')) { continue; }
        
            collapsibleField.classList.toggle('collapsed', this._collapsibleFieldStatesCache.shift());
        }
    }

    /**
     * Updates this view
     */
    update() {
        this.saveScrollPosition();
        this.saveCollapsibleFieldStates();

        super.update();
        
        this.restoreCollapsibleFieldStates();
        this.restoreScrollPosition();
    }
}

module.exports = ResourceEditor;
