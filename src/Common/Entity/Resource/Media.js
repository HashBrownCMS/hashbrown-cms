'use strict';

/**
 * The base class for all Media objects
 *
 * @memberof HashBrown.Common.Entity.Resource
 */
class Media extends HashBrown.Entity.Resource.ResourceBase {
    static get icon() { return 'file-image-o'; }
    get icon() { return this.isVideo() ? 'file-video-o' : this.isImage() ? 'file-image-o' : super.icon; }
    
    static get category() { return 'media'; }
    
    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(String, 'filename');
        this.def(String, 'folder', '/');
        this.def(String, 'caption');
        this.def(Object, 'author', {});
        this.def(Object, 'copyrightHolder', {});
        this.def(Number, 'copyrightYear');
    }

    /**
     * Gets the media provider
     *
     * @return {HashBrown.Entity.Resource.Connection} Connection
     */
    static async getProvider() {
        throw new Error('Method "getProvider" must be overridden');
    }
    
    /**
     * Sets the media provider
     *
     * @param {String} id
     */
    static async setProvider(id) {
        throw new Error('Method "setProvider" must be overridden');
    }
    
    /**
     * Gets the human readable name
     *
     * @return {String} Name
     */
    getName() {
        return this.caption || this.filename || this.id;
    }

    /**
     * Adopts values into this entity
     *
     * @param {Object} params
     */
    adopt(params = {}) {
        checkParam(params, 'params', Object);

        params = params || {};
        
        super.adopt(params);
    }
    
    /**
     * Gets the content type header
     *
     * @returns {String} Content-Type header
     */
    getContentTypeHeader() {
        let name = (this.filename || '').toLowerCase();

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
     * Gets whether this is a document
     *
     * @returns {Boolean} Is document
     */
    isDocument() {
        return this.getContentTypeHeader().indexOf('application') > -1;
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
