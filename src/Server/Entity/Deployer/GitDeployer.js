'use strict';

const Path = require('path');
const Url = require('url');

/**
 * Git deployer
 *
 * @memberof HashBrown.Server.Entity.Deployer
 */
class GitDeployer extends HashBrown.Entity.Deployer.DeployerBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);
    }
    
    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(String, 'username');
        this.def(String, 'password');
        this.def(String, 'repo');
        this.def(String, 'branch');
        this.def(String, 'path');
    }

    /**
     * Performs a validation check on the provided parameters
     */
    validate() {
        if(this.repo.indexOf('\'') > -1) { throw new Error('Illegal character "\'" found in repo URL'); }
        if(this.branch.indexOf('\'') > -1) { throw new Error('Illegal character "\'" found in branch name'); }
        if(this.username.indexOf('\'') > -1) { throw new Error('Illegal character "\'" found in username'); }
        if(this.password.indexOf('\'') > -1) { throw new Error('Illegal character "\'" found in password'); }

        let repoUrl = new URL(this.repo);

        if(!repoUrl.protocol || !repoUrl.host) { throw new Error('Malformed repo URL'); }
    }

    /**
     * Pulls the repo, and clones it if necessary
     *
     * @returns {Promise} Promise
     */
    async pullRepo() {
        this.validate();
        
        let gitPath = Path.join(APP_ROOT, 'storage', 'git');
        
        await HashBrown.Service.FileService.makeDirectory(gitPath);

        let repoPath = this.getRootPath();
       
        let dirExists = await HashBrown.Service.FileService.exists(repoPath);

        if(!dirExists) {
            let url = new URL(this.repo);
            
            if(this.username) {
                url.username = this.username;
                
                if(this.password) {
                    url.password = this.password;
                }
            }

            url = Url.format(url);

            await HashBrown.Service.AppService.exec(`git clone '${url}' '${repoPath}'`); 
        }

        await HashBrown.Service.AppService.exec('git config user.name "HashBrown CMS"', repoPath);
        await HashBrown.Service.AppService.exec('git config user.email "git@hashbrown.cms"', repoPath);
        await HashBrown.Service.AppService.exec(`git checkout ${this.branch || 'master'}`, repoPath);
        await HashBrown.Service.AppService.exec('git reset --hard', repoPath);
        await HashBrown.Service.AppService.exec('git pull', repoPath);
    }
    
    /**
     * Pushes the repo
     *
     * @returns {Promise} Promise
     */
    async pushRepo() {
        this.validate();
        
        let repoPath = this.getRootPath();
       
        await HashBrown.Service.AppService.exec('git add -A .', repoPath);
        
        try {
            await HashBrown.Service.AppService.exec('git commit -m "Commit from HashBrown CMS"', repoPath);
        } catch(e) {
            // If commit fails, it means there are no changes to push
            return;
        }
        
        await HashBrown.Service.AppService.exec('git push', repoPath);
    }

    /**
     * Gets the root path
     *
     * @returns {String} Root
     */
    getRootPath() {
        let dirName = Buffer.from(this.repo + (this.branch || 'master')).toString('base64');

        return Path.join(APP_ROOT, 'storage', 'git', dirName);
    }
    
    /**
     * Gets a deployment path
     *
     * @param {Array} parts
     *
     * @returns {String} Path
     */
    getPath(...parts) {
        let path = (parts || []).join('/');
        
        path = Path.join(this.getRootPath(), this.path, path);
    
        // If the path module removed doubles slashes for protocols, add them back
        path = (path || '').replace(/:\/([^\/])/, '://$1');

        return path;
    }

    /**
     * Tests this deployer
     *
     * @returns {Promise} Result
     */
    async test() {
        await this.pullRepo();
        
        return true;
    }

    /**
     * Gets a file
     *
     * @param {String} path
     *
     * @return {Promise} Promise
     */
    async getFile(path) {
        await this.pullRepo();

        return HashBrown.Service.FileService.read(path);
    }
    
    /**
     * Gets a folder
     *
     * @param {String} path
     * @param {Number} recursions
     *
     * @returns {Promise} List of files
     */
    async getFolder(path, recursions = 0) {
        for(let i = 0; i < recursions; i++) {
            path = Path.join(path, '*');
        }

        await this.pullRepo();
        
        return await HashBrown.Service.FileService.list(path);
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
        await this.pullRepo()

        let folder = Path.dirname(path);

        await HashBrown.Service.FileService.makeDirectory(folder);

        await HashBrown.Service.FileService.write(Buffer.from(base64, 'base64'), path);
        
        await this.pushRepo();   
    }
    
    /**
     * Renames a file
     *
     * @param {String} oldPath
     * @param {String} name
     *
     * @return {Promise} Promise
     */
    async renameFile(oldPath, name) {
        let newPath = Path.join(Path.dirname(oldPath), name);
        
        await this.pullRepo();

        await HashBrown.Service.FileService.move(oldPath, newPath);
        
        await this.pushRepo();
    }
   
    /**
     * Removes a file
     *
     * @param {String} path
     *
     * @return {Promise} Promise
     */
    async removeFile(path) {
        await this.pullRepo();

        await HashBrown.Service.FileService.remove(path);

        await this.pushRepo();
    }

    /**
     * Removes a folder
     *
     * @param {String} path
     *
     * @returns {Promise} Result
     */
    async removeFolder(path) {
        await this.pullRepo();

        await HashBrown.Service.FileService.remove(path);

        await this.pushRepo();
    }
}

module.exports = GitDeployer;
