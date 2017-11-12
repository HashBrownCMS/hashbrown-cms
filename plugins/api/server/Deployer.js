'use strict';

/**
 * API deployer
 */
class ApiDeployer extends HashBrown.Models.Deployer {
    // Name and alias
    static get name() { return 'API'; }
    static get alias() { return 'api'; }

    /**
     * Gets the root path
     *
     * @returns {String} Root
     */
    getRootPath() {
        return this.url;
    }

    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(String, 'rootPath');
    }

    /**
     * Tests this deployer
     *
     * @returns {Promise} Result
     */
    test() {
        return HashBrown.Helpers.RequestHelper.request('get', this.getPath('/test'));
    }

    /**
     * Gets a file
     *
     * @param {String} path
     *
     * @return {Promise} Promise
     */
    getFile(path) {
        return HashBrown.Helpers.RequestHelper.request('get', path);
    }
    
    /**
     * Gets a folder
     *
     * @param {String} path
     *
     * @returns {Promise} Result
     */
    getFolder(path) {
        return this.getFile(path);
    }
    
    /**
     * Set file
     *
     * @param {String} path
     * @param {String} base64
     * @param {Boolean} isBinary
     *
     * @return {Promise} Promise
     */
    setFile(path, base64, isBinary) {
        return HashBrown.Helpers.RequestHelper.request('post', path, {
            isBinary: isBinary || false,
            content: base64
        });
    }
   
    /**
     * Removes a file
     *
     * @param {String} path
     *
     * @return {Promise} Promise
     */
    removeFile(path) {
        return HashBrown.Helpers.RequestHelper.request('delete', path);
    }

    /**
     * Removes a folder
     *
     * @param {String} path
     *
     * @returns {Promise} Result
     */
    removeFolder(path) {
        return this.removeFile(path);
    }
}

module.exports = ApiDeployer;
