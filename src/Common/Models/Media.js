'use strict';

/**
 * The base class for all Media objects
 *
 * @memberof HashBrown.Common.Models
 */
class Media extends HashBrown.Models.Resource {
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
        this.def(Date, 'updateDate');
    }

    /**
     * Gets the content type header
     *
     * @returns {String} Content-Type header
     */
    getContentTypeHeader() {
        let name = (this.name || '').toLowerCase();
        let extension = name.split('.');
        
        if(extension && extension.length > 0) {
            extension = extension[extension.length - 1];
        }

        switch(extension) {
            // Image types
            case 'jpg':
                return 'image/jpeg';
            case 'png':
                return 'image/png';
            case 'gif':
                return 'image/gif';
            case 'bmp':
                return 'image/bmp';
            
            // Audio types
            case 'm4a':
                return 'audio/m4a';
            case 'mp3':
                return 'audio/mp3';
            case 'ogg':
                return 'audio/ogg';
            case 'wav':
                return 'audio/wav';
            
            // Video types
            case 'mp4':
                return 'video/mp4';
            case 'webm':
                return 'video/webm';
            case 'avi':
                return 'video/avi';
            case 'mov':
                return 'video/quicktime';
            case 'bmp':
                return 'video/bmp';
            case 'wmv':
                return 'video/x-ms-wmv';
            case '3gp':
                return 'video/3gpp';
            case 'mkv':
                return 'video/x-matroska';

            // SVG
            case 'svg':
                return 'image/svg+xml';
            
            // PDF
            case 'pdf':
                return 'application/pdf';

            // Everything else
            default:
                return 'application/octet-stream';
        }
    }
    
    /**
     * Gets whether this is audio
     *
     * @returns {Boolean} Is audio
     */
    isAudio() {
        return this.getContentTypeHeader().indexOf('audio') > -1;
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
     * Gets whether this is an SVG file
     *
     * @returns {Boolean} Is SVG file
     */
    isSvg() {
        return this.getContentTypeHeader().indexOf('svg') > -1;
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
