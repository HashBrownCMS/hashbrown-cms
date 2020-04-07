'use strict';

/**
 * The publication class
 *
 * @memberof HashBrown.Client.Entity.Resource
 */
class Publication extends require('Common/Entity/Resource/Publication') {
    /**
     * Structure
     */
    structure() {
        super.structure();
        
        this.def(Object, 'processor', {});
        this.def(Object, 'deployer', {});
    }
}

module.exports = Publication;
