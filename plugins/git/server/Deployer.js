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
    pullRepo() {
        let storagePath = Path.join(APP_ROOT, 'storage');
        
        if(!FileSystem.existsSync(storagePath)) { FileSystem.mkdirSync(storagePath); }

        let pluginsPath = Path.join(storagePath, 'plugins');

        if(!FileSystem.existsSync(pluginsPath)) { FileSystem.mkdirSync(pluginsPath); }

        let gitPath = Path.join(pluginsPath, 'git');
        
        if(!FileSystem.existsSync(gitPath)) { FileSystem.mkdirSync(gitPath); }
        
        let repoPath = Path.join(gitPath, Buffer.from(this.repo + (this.branch || 'master')).toString('base64'));
        
        return (() => {
            if(!FileSystem.existsSync(repoPath)) {
                let url = 'https://';
                
                if(this.username) {
                    url += this.username;
                    
                    if(this.password) {
                        url += ':' + this.password.replace(/@/g, '%40');
                    }
                        
                    url += '@';
                }

                url += this.repo;

                return HashBrown.Helpers.AppHelper.exec('git clone \'' + url + '\' \'' + repoPath + '\''); 
            }

            return Promise.resolve();
        })()
        .then(() => {
            return HashBrown.Helpers.AppHelper.exec('git config user.name "HashBrown CMS"', repoPath);
        })
        .then(() => {
            return HashBrown.Helpers.AppHelper.exec('git config user.email "git@hashbrown.cms"', repoPath);
        })
        .then(() => {
            return HashBrown.Helpers.AppHelper.exec('git checkout ' + (this.branch || 'master'), repoPath);
        })
        .then(() => {
            return HashBrown.Helpers.AppHelper.exec('git reset --hard', repoPath);
        })
        .then(() => {
            return HashBrown.Helpers.AppHelper.exec('git pull', repoPath);
        });
    }
    
    /**
     * Pushes the repo
     *
     * @returns {Promise} Promise
     */
    pushRepo() {
        let repoPath = APP_ROOT + this.getRootPath();
        
        return HashBrown.Helpers.AppHelper.exec('git add -A .', repoPath)
        .then(() => {
            return HashBrown.Helpers.AppHelper.exec('git commit -m "Commit from HashBrown CMS"', repoPath)
        })
        .then(() => {
            return HashBrown.Helpers.AppHelper.exec('git push', repoPath);
        });
    }

    /**
     * Gets the root path
     *
     * @returns {String} Root
     */
    getRootPath() {
        return '/' + Path.join('storage', 'plugins', 'git', Buffer.from(this.repo + (this.branch || 'master')).toString('base64'));
    }

    /**
     * Tests this deployer
     *
     * @returns {Promise} Result
     */
    test() {
        return this.pullRepo()
        .then(() => {
            return Promise.resolve(true);  
        });
    }

    /**
     * Gets a file
     *
     * @param {String} path
     *
     * @return {Promise} Promise
     */
    getFile(path) {
        return this.pullRepo()
        .then(() => {
            return new Promise((resolve, reject) => {
                FileSystem.readFile(path, (err, data) => {
                    if(err) { return reject(err); }

                    resolve(data);
                });
            });
        });
    }
    
    /**
     * Gets a folder
     *
     * @param {String} path
     * @param {Number} recursions
     *
     * @returns {Promise} List of files
     */
    getFolder(path, recursions = 0) {
        for(let i = 0; i < recursions; i++) {
            path += '/*';
        }

        path = path.replace('//', '/');

        return this.pullRepo()
        .then(() => {
            return new Promise((resolve, reject) => {
                Glob(APP_ROOT + path, (err, data) => {
                    if(err) { return reject(err); }

                    let files = [];

                    for(let fullPath of data) {
                        let relativePath = fullPath.replace(APP_ROOT + this.getRootPath(), '');

                        files.push({
                            name: Path.basename(relativePath),
                            path: fullPath
                        });
                    }

                    resolve(files);
                });
            });
        });
    }

    /**
     * Set file
     *
     * @param {String} path
     * @param {String} base64
     *
     * @return {Promise} Promise
     */
    setFile(path, base64) {
        return this.pullRepo()
        .then(() => {
            return new Promise((resolve, reject) => {
                let folder = Path.dirname(APP_ROOT + path);

                if(!FileSystem.existsSync(folder)) {
                    FileSystem.mkdirSync(folder);
                }

                FileSystem.writeFile(APP_ROOT + path, base64, 'base64', (err) => {
                    if(err) { return reject(err); }

                    resolve();
                });
            })
        })
        .then(() => {
            return this.pushRepo();   
        });
    }
    
    /**
     * Renames a file
     *
     * @param {String} oldPath
     * @param {String} name
     *
     * @return {Promise} Promise
     */
    renameFile(oldPath, name) {
        let newPath = Path.join(Path.dirname(oldPath), name);
        
        return this.pullRepo()
        .then(() => {
            return new Promise((resolve, reject) => {
                FileSystem.rename(oldPath, newPath, (err) => {
                    if(err) { reject(err); }

                    resolve();
                });
            });
        })
        .then(() => {
            return this.pushRepo();
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
        return this.pullRepo()
        .then(() => {
            return new Promise((resolve, reject) => {
                FileSystem.unlink(APP_ROOT + path, (err) => {
                    if(err) { reject(err); }

                    resolve();
                });
            });
        })
        .then(() => {
            return this.pushRepo();
        });
    }

    /**
     * Removes a folder
     *
     * @param {String} path
     *
     * @returns {Promise} Result
     */
    removeFolder(path) {
        return this.pullRepo()
        .then(() => {
            return new Promise((resolve, reject) => {
                RimRaf(APP_ROOT + path, (err) => {
                    if(err) { reject(err); }

                    resolve();
                });
            });
        })
        .then(() => {
            return this.pushRepo();
        });
    }
}

module.exports = GitDeployer;
