'use strict';

/**
 * A class for managing which other classes belong to which modules
 *
 * @memberof HashBrown.Common.Service
 */
class ModuleService {
    /**
     * Registers a module
     *
     * @param {String} alias
     * @param {String} name
     * @param {String} icon
     */
    static register(alias, name, icon) {
        checkParam(alias, 'alias', String, true);
        checkParam(name, 'name', String, true);
        checkParam(icon, 'icon', String, true);

        if(!this.modules) {
            this.modules = {};
        }

        if(this.modules[alias]) {
            throw new Error(`A module by alias "${alias}" has already been registered`);
        }

        this.modules[alias] = {
            alias: alias,
            name: name,
            icon: icon,
            classes: []
        };
    }

    /**
     * Adds a class to a module
     *
     * @param {Function} constructor
     * @param {String} alias
     */
    static addClass(constructor, alias) {
        checkParam(constructor, 'constructor', Function, true);
        checkParam(alias, 'alias', String, true);

        if(!this.modules || !this.modules[alias]) {
            throw new Error(`No module registered with alias "${alias}"`);
        }

        if(this.modules[alias].classes.indexOf(constructor) > -1) {
            throw new Error(`Class ${constructor.name} has already been added to module "${alias}"`);
        }

        this.modules[alias].classes.push(constructor);
    }

    /**
     * Gets a list of classes from a module
     *
     * @param {String} alias
     *
     * @return {Array} Classes
     */
    static getClasses(alias) {
        checkParam(alias, 'alias', String, true);

        if(!this.modules || !this.modules[alias]) {
            throw new Error(`No module registered with alias "${alias}"`);
        }

        return this.modules[alias].classes;
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
     * Gets the name of a module
     *
     * @param {String} alias
     *
     * @return {String} Name
     */
    static getName(alias) {
        checkParam(alias, 'alias', String);

        if(!alias || !this.modules[alias]) { return ''; }

        return this.modules[alias].name;
    }
    
    /**
     * Gets the icon of a module
     *
     * @param {String} alias
     *
     * @return {String} Icon
     */
    static getIcon(alias) {
        checkParam(alias, 'alias', String);

        if(!alias || !this.modules[alias]) { return ''; }

        return this.modules[alias].icon;
    }
    
    /**
     * Gets the module alias of a class
     *
     * @param {Function} constructor
     *
     * @return {String} Alias
     */
    static getAlias(constructor) {
        checkParam(constructor, 'constructor', Function, true);

        if(!this.modules) { return ''; }

        for(let alias in this.modules) {
            if(this.modules[alias].classes.indexOf(constructor) < 0) { continue; }

            return alias;
        }

        return '';
    }

    /**
     * Gets a list of all module aliases
     *
     * @return {Array} Aliases
     */
    static getAliases() {
        if(!this.modules) { return []; }

        return Object.keys(this.modules);
    }
}

module.exports = ModuleService;
