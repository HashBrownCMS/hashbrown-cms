'use strict';

/**
 * The base class for all Media objects
 *
 * @memberof HashBrown.Common.Entity.Resource
 */
class Media extends HashBrown.Entity.Resource.ResourceBase {
    static get category() { return 'media'; }
    
    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(String, 'name');
        this.def(String, 'folder', '/');
    }

    /**
     * Gets the human readable name
     *
     * @return {String} Name
     */
    getName() {
        return this.name;
    }

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

        if(params.url) {
            params.path = params.url;
            delete params.url;
        }

        if(!params.folder) {
            params.folder = '/';
        }

        return params;
    }
    
    /**
     * Gets the content type header
     *
     * @returns {String} Content-Type header
     */
    getContentTypeHeader() {
        let name = (this.name || '').toLowerCase();

        return getMIMEType(name); 
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
}

module.exports = Media;
