'use strict';

/**
 * The base for all resource editors
 */
class ResourceEditor extends HashBrown.Views.Editors.Editor {
    constructor(params) {
        super(params);

        UI.spinner(this.element, true);

        HashBrown.Helpers.EventHelper.on('resource', 'editor', (id) => { this.onResourceChanged(id); });
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
