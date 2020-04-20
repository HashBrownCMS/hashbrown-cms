'use strict';

/**
 * A class for managing which other classes belong to which libraries
 *
 * @memberof HashBrown.Common.Service
 */
class LibraryService {
    /**
     * Registers a library
     *
     * @param {String} alias
     * @param {String} name
     * @param {String} icon
     */
    static register(alias, name, icon) {
        checkParam(alias, 'alias', String, true);
        checkParam(name, 'name', String, true);
        checkParam(icon, 'icon', String, true);

        if(!this.libraries) {
            this.libraries = {};
        }

        if(this.libraries[alias]) {
            throw new Error(`A library by alias "${alias}" has already been registered`);
        }

        this.libraries[alias] = {
            alias: alias,
            name: name,
            icon: icon,
            classes: []
        };
    }

    /**
     * Adds a class to a library
     *
     * @param {Function} constructor
     * @param {String} alias
     */
    static addClass(constructor, alias) {
        checkParam(constructor, 'constructor', Function, true);
        checkParam(alias, 'alias', String, true);

        if(!this.libraries || !this.libraries[alias]) {
            throw new Error(`No library registered with alias "${alias}"`);
        }

        if(this.libraries[alias].classes.indexOf(constructor) > -1) {
            throw new Error(`Class ${constructor.name} has already been added to library "${alias}"`);
        }

        this.libraries[alias].classes.push(constructor);
    }

    /**
     * Gets a list of classes from a library
     *
     * @param {String} alias
     *
     * @return {Array} Classes
     */
    static getClasses(alias) {
        checkParam(alias, 'alias', String, true);

        if(!this.libraries || !this.libraries[alias]) {
            throw new Error(`No library registered with alias "${alias}"`);
        }

        return this.libraries[alias].classes;
    }
    
    /**
     * Gets a class inheriting a type
     *
     * @param {String} alias
     * @param {Function} type
     *
     * @return {Function} Class
     */
    static getClass(alias, type) {
        checkParam(alias, 'alias', String);
        checkParam(type, 'type', Function);

        if(!alias || !type) { return null; }

        for(let constructor of this.getClasses(alias)) {
            if(constructor.prototype instanceof type === false) { continue; }

            return constructor;
        }

        return null;
    }
    
    /**
     * Gets the name of a library
     *
     * @param {String} alias
     *
     * @return {String} Name
     */
    static getName(alias) {
        checkParam(alias, 'alias', String);

        if(!alias || !this.libraries[alias]) { return ''; }

        return this.libraries[alias].name;
    }
    
    /**
     * Gets the icon of a library
     *
     * @param {String} alias
     *
     * @return {String} Icon
     */
    static getIcon(alias) {
        checkParam(alias, 'alias', String);

        if(!alias || !this.libraries[alias]) { return ''; }

        return this.libraries[alias].icon;
    }
    
    /**
     * Gets the library alias of a class
     *
     * @param {Function} constructor
     *
     * @return {String} Alias
     */
    static getAlias(constructor) {
        checkParam(constructor, 'constructor', Function, true);

        if(!this.libraries) { return ''; }

        for(let alias in this.libraries) {
            if(this.libraries[alias].classes.indexOf(constructor) < 0) { continue; }

            return alias;
        }

        return '';
    }

    /**
     * Gets a list of all library aliases
     *
     * @return {Array} Aliases
     */
    static getAliases() {
        if(!this.libraries) { return []; }

        return Object.keys(this.libraries);
    }
}

module.exports = LibraryService;
