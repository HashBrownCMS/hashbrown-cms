'use strict';

const Path = require('path');

const Resource = require('./Resource');

/**
 * The base class for all Media objects
 *
 * @memberof HashBrown.Common.Models
 */
class Media extends Resource {
    /**
     * Checks the format of the params
     *
     * @params {Object} params
     *
     * @returns {Object} Params
     */
    static paramsCheck(params) {
        params = super.paramsCheck(params);

        delete params.remote;
        delete params.sync;
        delete params.isRemote;

        if(!params.folder) {
            params.folder = '/';
        }

        return params;
    }
    
    /**
     * Structure
     */
    structure() {
        this.def(String, 'id');
        this.def(String, 'icon', 'file-image-o');
        this.def(String, 'name');
        this.def(String, 'url');
        this.def(String, 'path');
        this.def(String, 'folder', '/');
    }

    /**
     * Read from file path
     *
     * @param {String} filePath
     */
    readFromFilePath(filePath) {
        let name = Path.basename(filePath);
        let id = filePath;
       
        // Trim file path for id 
        id = id.replace('/' + name, '');
        id = id.substring(id.lastIndexOf('/') + 1);
        
        // Remove file extension
        name = name.replace(/\.[^/.]+$/, '');
     
        this.id = id;
        this.name = name;
        this.url = '/media/' + HashBrown.Helpers.ProjectHelper.currentProject + '/' + HashBrown.Helpers.ProjectHelper.currentEnvironment + '/' + id;
    }

    /**
     * Gets the content type header
     *
     * @returns {String} Content-Type header
     */
    getContentTypeHeader() {
        let name = (this.name || '').toLowerCase();

        // Image types
        if(name.match(/\.jpg/)) {
            return 'image/jpeg';
        } else if(name.match(/\.png/)) {
            return 'image/png';
        } else if(name.match(/\.gif/)) {
            return 'image/gif';
        } else if(name.match(/\.bmp/)) {
            return 'image/bmp';
        
        // Video types
        } else if(name.match(/\.mp4/)) {
            return 'video/mp4';
        } else if(name.match(/\.avi/)) {
            return 'video/avi';
        } else if(name.match(/\.mov/)) {
            return 'video/quicktime';
        } else if(name.match(/\.bmp/)) {
            return 'video/bmp';
        } else if(name.match(/\.wmv/)) {
            return 'video/x-ms-wmv';
        } else if(name.match(/\.3gp/)) {
            return 'video/3gpp';
        } else if(name.match(/\.mkv/)) {
            return 'video/x-matroska';

        // SVG
        } else if(name.match(/\.svg/)) {
            return 'image/svg+xml';
        
        // PDF
        } else if(name.match(/\.pdf/)) {
            return 'application/pdf';

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
     * Gets whether this is a PDF
     *
     * @returns {Boolean} Is PDF
     */
    isPdf() {
        return this.getContentTypeHeader().indexOf('pdf') > -1;
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
            id: Media.createId()
        });
    
        return media;
    }
}

module.exports = Media;
