'use strict';

/**
 * A browser modal for Media objects
 *
 * @memberof HashBrown.Client.Entity.View.Modal
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
        let items = await HashBrown.Entity.Resource.Media.list() || [];
        
        this.state.folders = [];

        for(let item of items) {
            if(!item.folder || item.folder === '/' || this.state.folders.indexOf(item.folder) > -1) { continue; }

            this.state.folders.push(item.folder);
        }

        this.state.items = [];

        if(this.state.name === 'searching') {
            let query = (this.state.searchQuery || '').toLowerCase();

            for(let item of items) {
                if(query && (item.getName() || '').toLowerCase().indexOf(query) < 0) { continue; }

                this.state.items.push(item);
            }

        } else if(this.state.name === undefined) {
            for(let item of items) {
                if(!item.folder) { item.folder = '/'; }

                let currentFolder = this.state.folder.split('/').filter(Boolean).join('/');
                let itemFolder = item.folder.split('/').filter(Boolean).join('/');

                if(currentFolder !== itemFolder) { continue; }

                this.state.items.push(item);
            }
        }
    }

    /**
     * Event: Click upload
     */
    onClickUpload() {
        let modal = HashBrown.Entity.View.Modal.UploadMedia.new({
            model: {
                folder: this.state.folder 
            }
        });
            
        modal.on('success', (ids) => {
            this.update();
        });
    }

    /**
     * Event: Click search
     */
    onClickSearch(query) {
        this.state.name = 'searching';
        this.state.searchQuery = query;
    
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
     * Event: Click select
     */
    onClickSelect() {
        if(!this.state.selectedItemId) { return; }

        this.trigger('pick', this.state.selectedItemId);

        this.close();
    }

    /**
     * Event: Click item
     *
     * @param {String} itemId
     */
    onClickItem(itemId) {
        this.state.selectedItemId = itemId;

        for(let item of Array.from(this.element.querySelectorAll('.modal--media-browser__item') || [])) {
            item.classList.toggle('selected', item.dataset.id === itemId);
        }

        this.namedElements.select.disabled = false;

        this.namedElements.preview.innerHTML = '';

        this.namedElements.preview.appendChild(new HashBrown.Entity.View.Widget.Media({
            model: {
                readonly: true,
                value: itemId
            }
        }).element);
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
