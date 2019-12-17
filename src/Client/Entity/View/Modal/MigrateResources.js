'use strict';

/**
 * The editor for migrating resources between environments
 *
 * @memberof HashBrown.Client.Entity.View.Modal
 */
class MigrateResources extends HashBrown.Entity.View.Modal.ModalBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.state = {
            from: this.model.environments[1],
            to: this.model.environments[0],
            settings: {},
            resourceOptions: {
                replace: 'Overwrite on target',
                schemas: 'Schemas',
                content: 'Content',
                forms: 'Forms',
                media: 'Media',
                connections: 'Connections'
            }
        };


        this.template = require('template/modal/migrateResources');
    }

    /**
     * Event: Changed from option
     */
    onChangeFromOption(environment) {
        this.state.from = environment;
        this.state.to = this.model.environments.filter((environment) => environment !== this.state.from)[0]; 
    
        this.render();
    }
    
    /**
     * Event: Changed to option
     */
    onChangeToOption(environment) {
        this.state.to = environment;
    
        this.render();
    }
   
    /**
     * Event: Changed resource option
     */
    onChangeResourceOption(key, value) {
        this.state.settings[key] = value;
    }

    /**
     * Event: Clicked migrate
     */
    async onClickMigrate() {
        try {
            await HashBrown.Service.RequestService.request('post', 'server/migrate/' + this.model.id, this.state)
       
            this.trigger('change');
            
            this.setState('success', { to: this.state.to, from: this.state.from });
        
        } catch(e) {
            this.setErrorState(e);

        }
    }
}

module.exports = MigrateResources;
