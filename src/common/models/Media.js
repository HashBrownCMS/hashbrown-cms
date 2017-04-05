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
        this.def(Boolean, 'remote', true);
        this.def(String, 'icon', 'file-image-o');
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
        
        // Video types
        } else if(this.name.match(/\.mp4/)) {
            return 'video/mp4';
        } else if(this.name.match(/\.avi/)) {
            return 'video/avi';
        } else if(this.name.match(/\.mov/)) {
            return 'video/quicktime';
        } else if(this.name.match(/\.bmp/)) {
            return 'video/bmp';
        } else if(this.name.match(/\.wmv/)) {
            return 'video/x-ms-wmv';
        } else if(this.name.match(/\.3gp/)) {
            return 'video/3gpp';
        } else if(this.name.match(/\.mkv/)) {
            return 'video/x-matroska';

        // SVG
        } else if(this.name.match(/\.svg/)) {
            return 'image/svg+xml';
        
        // Everything else
        } else {
            return 'application/octet-stream';
        }
    }

    /**
     * Gets whether this is a video
     *
     * @returns {Boolean} Is video
     */
    isVideo() {
        return this.getContentTypeHeader().indexOf('video') > -1;
    }
    
    /**
     * Gets whether this is an image
     *
     * @returns {Boolean} Is image
     */
    isImage() {
        return this.getContentTypeHeader().indexOf('image') > -1;
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
