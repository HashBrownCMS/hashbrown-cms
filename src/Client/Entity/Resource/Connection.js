'use strict';

/**
 * The client side Connection class
 *
 * @memberof HashBrown.Client.Entity.Resource
 */
class Connection extends require('Common/Entity/Resource/Connection') {
    static get icon() { return 'exchange'; }
    
    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(Object, 'processor', {});
        this.def(Object, 'deployer', {});
    }
}

module.exports = Connection;
