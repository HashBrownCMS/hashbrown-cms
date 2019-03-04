'use strict';

const FileSystem = require('fs');
const Glob = require('glob');
const Path = require('path');
const RimRaf = require('rimraf');

/**
 * Git deployer
 */
class GitDeployer extends HashBrown.Models.Deployer {
    // Name and alias
    static get name() { return 'Git'; }
    static get alias() { return 'git'; }

    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        if(this.repo.indexOf('https://') === 0) {
            this.repo = this.repo.replace('https://', '');
        }
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
    }

    /**
     * Pulls the repo, and clones it if necessary
     *
     * @returns {Promise} Promise
     */
    async pullRepo() {
        let gitPath = Path.join(APP_ROOT, 'plugins', 'git');
        
        await HashBrown.Helpers.FileHelper.makeDirectory(gitPath);

        let repoPath = this.getRootPath();
       
        let dirExists = await HashBrown.Helpers.FileHelper.exists(repoPath);

        if(!dirExists) {
            let url = 'https://';
            
            if(this.username) {
                url += this.username;
                
                if(this.password) {
                    url += ':' + this.password.replace(/@/g, '%40');
                }
                    
                url += '@';
            }

            url += this.repo;

            await HashBrown.Helpers.AppHelper.exec('git clone \'' + url + '\' \'' + repoPath + '\''); 
        }

        await HashBrown.Helpers.AppHelper.exec('git config user.name "HashBrown CMS"', repoPath);
        await HashBrown.Helpers.AppHelper.exec('git config user.email "git@hashbrown.cms"', repoPath);
        await HashBrown.Helpers.AppHelper.exec('git checkout ' + (this.branch || 'master'), repoPath);
        await HashBrown.Helpers.AppHelper.exec('git reset --hard', repoPath);
        await HashBrown.Helpers.AppHelper.exec('git pull', repoPath);
    }
    
    /**
     * Pushes the repo
     *
     * @returns {Promise} Promise
     */
    async pushRepo() {
        let repoPath = this.getRootPath();
        
        await HashBrown.Helpers.AppHelper.exec('git add -A .', repoPath);
        await HashBrown.Helpers.AppHelper.exec('git commit -m "Commit from HashBrown CMS"', repoPath);
        await HashBrown.Helpers.AppHelper.exec('git push', repoPath);
    }

    /**
     * Gets the root path
     *
     * @returns {String} Root
     */
    getRootPath() {
        return Path.join(APP_ROOT, 'storage', 'plugins', 'git', Buffer.from(this.repo + (this.branch || 'master')).toString('base64'));
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

        return HashBrown.Helpers.FileHelper.read(path);
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
        
        let files = await HashBrown.Helpers.FileHelper.list(path);
        
        for(let i = 0; i < files.length; i++) {
            let fullPath = files[i];
            let relativePath = fullPath.replace(this.getRootPath(), '');

            files[i] = {
                name: Path.basename(relativePath),
                path: fullPath
            };
        }

        return files;
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

        await HashBrown.Helpers.FileHelper.makeDirectory(folder);

        await HashBrown.Helpers.FileHelper.write(path, Buffer.from(base64, 'base64'));
        
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

        await HashBrown.Helpers.FileHelper.move(oldPath, newPath);
        
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

        await HashBrown.Helpers.FileHelper.remove(Path.join(APP_DOOR, path));

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

        await HashBrown.Helpers.FileHelper.remove(Path.join(APP_DOOR, path));

        await this.pushRepo();
    }
}

module.exports = GitDeployer;
