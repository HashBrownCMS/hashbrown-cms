'use strict';

/**
 * The user entity type
 *
 * @memberof HashBrown.Client.Entity
 */
class User extends require('Common/Entity/User') {
    /**
     * Gets whether this user is the current one
     *
     * @return {Boolean} Is current
     */
    get isCurrent() {
        return this.id === HashBrown.Context.user.id;
    }

    /**
     * Saves the current state of this entity
     *
     * @param {Object} options
     */
    async save(options = {}) {
        let data = this.getObject();
        
        if(options && Object.keys(options).length > 0) {
            options = '?' + new URLSearchParams(options).toString();
        } else {
            options = '';
        }

        await HashBrown.Service.RequestService.customRequest('post', '/api/users/' + this.id + options, data);
    }
    
    /**
     * Gets a list of instances of this entity type
     *
     * @param {Object} options
     *
     * @return {Array} Instances
     */
    static async list(options = {}) {
        let users = await HashBrown.Service.RequestService.customRequest('get', '/api/users') || [];
        
        for(let i in users) {
            users[i] = this.new(users[i]);
        }

        return users;
    }
    
    /**
     * Gets an instance of this entity type
     *
     * @param {String} id
     *
     * @return {HashBrown.Entity.Resource.ResourceBase} Instance
     */
    static async get(id) {
        checkParam(id, 'id', String);

        if(!id) { return null; }

        let user = await HashBrown.Service.RequestService.customRequest('get', '/api/users/' + id);
            
        if(!user) { return null; }

        user = this.new(user);
        
        return user;
    }
}

module.exports = User;
