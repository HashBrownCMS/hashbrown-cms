'use strict';

/**
 * The modal for picking/creating/removing folders
 *
 * @memberof HashBrown.Client.Entity.View.Modal
 */
class Folders extends HashBrown.Entity.View.Modal.ModalBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/modal/folders');
    }

    /**
     * Fetches the folders
     */
    fetch() {
        // Establish abstract root
        this.state.root = {
            name: '/',
            path: '/',
            children: []
        };

        // Map folders, including generated ones
        let map = {};

        map['/'] = this.state.root;

        for(let path of this.model.folders || []) {
            let parts = path.split('/').filter((x) => !!x) || [];
            
            while(parts.length > 0) {
                let thisPath = '/' + parts.join('/') + '/';
            
                let name = parts.pop();

                let parentPath = '/';

                if(parts.length > 0) {
                    parentPath += parts.join('/') + '/';
                }

                if(!map[thisPath]) {
                    map[thisPath] =  {
                        name: name, 
                        path: thisPath,
                        parentPath: parentPath,
                        children: []
                    };
                }
            }
        }

        // Place folders into hierarchy
        for(let path in map) {
            let folder = map[path];

            if(map[folder.parentPath]) {
                map[folder.parentPath].children.push(folder);
            }
        }
    }

    /**
     * Event: Clicked confirm add
     */
    onClickConfirmAdd() {
        let name = this.namedElements.adding.model.value || '';

        name = name.replace(/\//g, '');

        if(!name) { return; }

        let newPath = this.state.addToPath + name;

        this.trigger('picked', newPath);

        this.close();
    }

    /**
     * Event: Clicked add
     */
    onClickAdd(parentPath) {
        this.state.name = 'adding';
        this.state.addToPath = parentPath;

        this.update();
    }
    
    /**
     * Event: Changed folder name
     */
    onChangeName(oldPath, newPath) {
        this.trigger('renamed', oldPath, newPath); 
    }

    /**
     * Event: Removed folder
     */
    onRemove(path) {
        this.trigger('removed', path); 
    }

    /**
     * Event: Clicked folder
     */
    onPick(path) {
        this.trigger('picked', path);

        this.close();
    }
}

module.exports = Folders;
