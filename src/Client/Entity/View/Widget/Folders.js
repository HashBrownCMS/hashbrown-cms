'use strict';

/**
 * The widget for picking/creating/removing folders
 *
 * @memberof HashBrown.Client.Entity.View.Widget
 */
class Folders extends HashBrown.Entity.View.Widget.WidgetBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/widget/folders');
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

        for(let path of this.model.options || []) {
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

        this.model.options.push(newPath);
        this.model.options.sort();

        this.update();
        
        if(typeof this.model.onadd === 'function') {
            this.model.onadd(newPath);
        }
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
        for(let i in this.model.options) {
            if(this.model.options[i] === oldPath) {
                this.model.options[i] = newPath;
            }
        }
        
        this.update();
        
        if(typeof this.model.onrename === 'function') {
            this.model.onrename(oldPath, newPath);
        }
    }

    /**
     * Event: Removed folder
     */
    onRemove(path) {
        let index = this.model.options.indexOf(path);

        if(index < 0) { return; }

        this.model.options.splice(index, 1);

        this.update();
        
        if(typeof this.model.onremove === 'function') {
            this.model.onremove(path);
        }
    }

    /**
     * Event: Clicked folder
     */
    onClick(path) {
        if(typeof this.model.onclick === 'function') {
            this.model.onclick(path);
        }
    }
}

module.exports = Folders;
