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
    }

    /**
     * Fetches all media
     */
    async fetch() {
        this.state.items = await HashBrown.Service.MediaService.getAllMedia();
        
        // Establish abstract root folder
        this.state.rootFolder = {
            name: '/',
            path: '/',
            children: []
        };

        // Map folders, including generated ones
        let map = {};

        map['/'] = this.state.rootFolder;

        for(let item of this.state.items || []) {
            let parts = item.folder.split('/').filter((x) => !!x) || [];
            
            while(parts.length > 0) {
                let thisPath = '/' + parts.join('/') + '/';
            
                let name = parts.pop();

                let parentPath = '/';

                if(parts.length > 0) {
                    parentPath += parts.join('/') + '/';
                }

                if(!map[thisPath]) {
                    map[thisPath] =  {
                        name: name, 
                        path: thisPath,
                        parentPath: parentPath,
                        children: []
                    };
                }
            }
        }

        // Place folders into hierarchy
        for(let path in map) {
            let folder = map[path];

            if(map[folder.parentPath]) {
                map[folder.parentPath].children.push(folder);
            }
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
        for(let item of Array.from(this.namedElements.items.children)) {
            if(!path || item.dataset.folder === path) {
                item.removeAttribute('style');
            } else {
                item.style.display = 'none';
            }
        }
    }
}

module.exports = MediaBrowser;
