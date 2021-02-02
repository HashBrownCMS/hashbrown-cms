'use strict';

/**
 * API deployer
 *
 * @memberof HashBrown.Server.Entity.Deployer
 */
class ApiDeployer extends HashBrown.Entity.Deployer.DeployerBase {
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
        return await HashBrown.Service.RequestService.request('get', this.getPath('/test'));
    }

    /**
     * Gets a file
     *
     * @param {String} path
     *
     * @return {Object} File
     */
    async getFile(path) {
        return await HashBrown.Service.RequestService.request('get', path);
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
        await HashBrown.Service.RequestService.request('put', `${path}?token=${this.token}`, base64);
    }
    
    /**
     * Rename file
     *
     * @param {String} path
     * @param {String} name
     */
    async renameFile(path, name) {
        await HashBrown.Service.RequestService.request('patch', `${path}?token=${this.token}`, name);
    }
   
    /**
     * Removes a file
     *
     * @param {String} path
     */
    async removeFile(path) {
        await HashBrown.Service.RequestService.request('delete', `${path}?token=${this.token}`);
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
