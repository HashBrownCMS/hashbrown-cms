'use strict';

const ConnectionCommon = require('Common/Models/Connection');

/**
 * The client side Connection class
 *
 * @memberof HashBrown.Client.Models
 */
class Connection extends ConnectionCommon {
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
