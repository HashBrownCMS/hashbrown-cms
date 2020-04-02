'use strict';

/**
 * The editor for migrating resources between environments
 *
 * @memberof HashBrown.Client.Entity.View.Modal
 */
class MigrateResources extends HashBrown.Entity.View.Modal.ModalBase {
    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(String, 'category');
    }
    
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/modal/migrateResources');
    }
   
    /**
     * Fetches the model data
     */
    async fetch() {
        let model = HashBrown.Entity.Resource.ResourceBase.getModel(this.category);

        if(!model) {
            throw new Error(`No model found for category ${this.category}`);
        }

        let allResources = await model.list();

        this.state.resourceOptions = {};
       
        for(let resource of allResources) {
            this.state.resourceOptions[resource.getName()] = resource.id;
        }

        if(this.state.resources && this.state.resources.length > 0) {
            this.state.dependencies = await HashBrown.Service.RequestService.request(
                'get',
                this.category + '/dependencies',
                null,
                {
                    resources: this.state.resources.join(',')
                }
            );
       
            for(let category in this.state.dependencies) {
                let model = HashBrown.Entity.Resource.ResourceBase.getModel(category);

                if(!model) { continue; }

                for(let id in this.state.dependencies[category]) {
                    this.state.dependencies[category][id] = model.new(this.state.dependencies[category][id]);
                }
            }

        } else {
            this.state.dependencies = {};

        }
    }

    /**
     * Event: Changed project option
     */
    onChangeProject(project) {
        this.state.project = project;
    }

    /**
     * Event: Changed environment option
     */
    onChangeEnvironment(environment) {
        this.state.environment = environment;
    }
    
    /**
     * Event: Changed resources
     */
    onChangeResources(resources) {
        this.state.resources = resources;

        this.update();
    }
   
    /**
     * Event: Clicked migrate
     */
    async onClickMigrate() {
        try {
            await HashBrown.Service.RequestService.request(
                'post',
                this.category + '/migrate',
                {
                    project: this.state.project,
                    environment: this.state.environment,
                    resources: this.state.resources
                }
            );
       
            this.close();
        
        } catch(e) {
            this.setErrorState(e);

        }
    }
}

module.exports = MigrateResources;
