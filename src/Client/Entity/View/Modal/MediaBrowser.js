'use strict';

/**
 * A browser modal for Media objects
 *
 * @memberof HashBrown.Entity.Client.View.Modal
 */
class MediaBrowser extends HashBrown.Entity.View.Modal.ModalBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);
    
        this.template = require('template/modal/mediaBrowser');
        this.state.folder = '/';
    }

    /**
     * Fetches all media and caches folder paths
     */
    async fetch() {
        let items = await HashBrown.Service.MediaService.getAllMedia() || [];
        
        this.state.folders = [];

        for(let item of items) {
            if(!item.folder || item.folder === '/' || this.state.folders.indexOf(item.folder) > -1) { continue; }

            this.state.folders.push(item.folder);
        }

        this.state.items = [];

        if(this.state.name === 'searching') {
            let query = (this.state.searchQuery || '').toLowerCase();

            for(let item of items) {
                if(query && (item.name || '').toLowerCase().indexOf(query) < 0) { continue; }

                this.state.items.push(item);
            }

        } else if(this.state.name === undefined) {
            for(let item of items) {
                if(!item.folder) { item.folder = '/'; }

                if(this.state.folder !== item.folder) { continue; }

                this.state.items.push(item);
            }
        }
    }

    /**
     * Event: Click search
     */
    onClickSearch() {
        this.state.name = 'searching';
        this.state.searchQuery = (this.namedElements.search.model.value || '').toLowerCase();
    
        this.update();
    }

    /**
     * Event: Click clear search
     */
    onClickClearSearch() {
        this.state.name = undefined;
        this.state.searchQuery = '';
    
        this.update();
    }

    /**
     * Event: Click item
     *
     * @param {String} itemId
     */
    onClickItem(itemId) {
        this.trigger('pick', itemId);

        this.close();
    }

    /**
     * Event: Click folder
     *
     * @param {String} path
     */
    onClickFolder(path) {
        this.state.folder = path;

        this.update();
    }
}

module.exports = MediaBrowser;
