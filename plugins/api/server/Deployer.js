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

        this.def(String, 'url');
        this.def(String, 'token');
    }

    /**
     * Tests this deployer
     *
     * @returns {String} Result
     */
    async test() {
        return await HashBrown.Helpers.RequestHelper.request('get', this.getPath('/test'));
    }

    /**
     * Gets a file
     *
     * @param {String} path
     *
     * @return {Object} File
     */
    async getFile(path) {
        return await HashBrown.Helpers.RequestHelper.request('get', path);
    }
    
    /**
     * Gets a folder
     *
     * @param {String} path
     *
     * @returns {Object} Folder
     */
    async getFolder(path) {
        return await this.getFile(path);
    }
    
    /**
     * Set file
     *
     * @param {String} path
     * @param {String} base64
     *
     * @return {Promise} Promise
     */
    async setFile(path, base64) {
        await HashBrown.Helpers.RequestHelper.request('post', path, base64);
    }
    
    /**
     * Rename file
     *
     * @param {String} path
     * @param {String} name
     */
    async renameFile(path, name) {
        await HashBrown.Helpers.RequestHelper.request('post', path, name);
    }
   
    /**
     * Removes a file
     *
     * @param {String} path
     */
    async removeFile(path) {
        await HashBrown.Helpers.RequestHelper.request('delete', path);
    }

    /**
     * Removes a folder
     *
     * @param {String} path
     */
    async removeFolder(path) {
        await this.removeFile(path);
    }
}

module.exports = ApiDeployer;
