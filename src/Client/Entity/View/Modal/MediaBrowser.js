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

        for(let item of items) {
            if(!item.folder) { item.folder = '/'; }

            if(this.state.folder !== item.folder) { continue; }

            this.state.items.push(item);
        }
    }

    /**
     * Event: Search
     */
    onSearch(query) {
        query = (query || '').toLowerCase();

        for(let item of Array.from(this.namedElements.items.children)) {
            let name = (item.title || '').toLowerCase();

            if(name.indexOf(query) > -1) {
                item.removeAttribute('style');
            } else {
                item.style.display = 'none';
            }
        }
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
