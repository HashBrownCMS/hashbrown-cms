'use strict';

/**
 * The modal for migrating resources between environments to projects
 *
 * @memberof HashBrown.Client.Entity.View.Modal
 */
class MigrateEnvironments extends HashBrown.Entity.View.Modal.ModalBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.updateToOptions();
        
        this.template = require('template/modal/migrateEnvironments');
    }

    /**
     * Event: Clicked migrate
     */
    async onClickMigrate() {
        try {
            if(!this.state.from) {
                throw new Error('Missing "from" environment');
            }
            
            if(!this.state.to) {
                throw new Error('Missing "to" environment');
            }

            await HashBrown.Service.RequestService.request('post', 'projects/' + this.model.id + '/migrate', {
                from: this.state.from,
                to: this.state.to
            });

            this.close();

        } catch(e) {
            this.setErrorState(e);

        }
    }

    /**
     * Updates the "to" options
     */
    updateToOptions() {
        this.state.toOptions = [];

        for(let environment of this.model.environments) {
            if(environment === this.state.from) { continue; }

            this.state.toOptions.push(environment);
        }
    }

    /**
     * Event: Changed to environment
     */
    onChangeTo(to) {
        this.state.to = to;
    }
}

module.exports = MigrateEnvironments;
