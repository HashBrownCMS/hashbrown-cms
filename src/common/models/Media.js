'use strict';

// Libs
let path = require('path');

let Entity = require('./Entity');

/**
 * The base class for all Media objects
 */
class Media extends Entity {
    structure() {
        this.def(String, 'id');
        this.def(String, 'name');
        this.def(String, 'url');
        this.def(String, 'folder');
    }

    /**
     * Read from file path
     *
     * @param {String} filePath
     */
    readFromFilePath(filePath) {
        let name = path.basename(filePath);
        let id = filePath;
       
        // Trim file path for id 
        id = id.replace('/' + name, '');
        id = id.substring(id.lastIndexOf('/') + 1);
        
        // Remove file extension
        name = name.replace(/\.[^/.]+$/, '');
     
        this.id = id;
        this.name = name;
        this.url = '/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + id;
    }

    /**
     * Gets the content type header
     *
     * @returns {String} Content-Type header
     */
    getContentTypeHeader() {
        this.name = this.name || '';

        // Image types
        if(this.name.match(/\.jpg/)) {
            return 'image/jpeg';
        } else if(this.name.match(/\.png/)) {
            return 'image/png';
        } else if(this.name.match(/\.gif/)) {
            return 'image/gif';
        } else if(this.name.match(/\.bmp/)) {
            return 'image/bmp';

        // SVG
        } else if(this.name.match(/\.svg/)) {
            return 'image/svg+xml';
        
        // Everything else
        } else {
            return 'application/octet-stream';
        }
    }

    /**
     * Applies folder string from tree
     *
     * @param {Object} tree
     */
    applyFolderFromTree(tree) {
        if(tree) {
            for(let i in tree) {
                let item = tree[i];

                if(item.id == this.id) {
                    this.folder = item.folder;
                    break;
                }
            }
        }
    }

    /**
     * Creates a new Media object
     *
     * @param {Object} file
     *
     * @return {Media} media
     */
    static create(file) {
        let media = new Media({
            id: Entity.createId()
        });
    
        return media;
    }
}

module.exports = Media;
