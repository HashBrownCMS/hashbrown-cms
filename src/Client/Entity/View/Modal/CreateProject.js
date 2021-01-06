'use strict';

/**
 * The modal for creating projects
 *
 * @memberof HashBrown.Client.Entity.View.Modal
 */
class CreateProject extends HashBrown.Entity.View.Modal.ModalBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/modal/createProject');
    }

    /**
     * Init
     */
    async init() {
        await super.init();

        this.element.querySelector('input').focus();
    }

    /**
     * Event: Clicked create
     */
    async onClickCreate() {
        try {
            if(!this.state.projectName || this.state.projectName.length < 2) {
                throw new Error('The project name is too short');
            }
            
            await HashBrown.Service.RequestService.request('post', 'projects/new', { name: this.state.projectName, id: this.state.projectId });

            this.trigger('change');

            this.close();

        } catch(e) {
            this.setErrorState(e);

        }
    }
        
    /**
     * Event: Input name
     */
    onInputName(name) {
        this.state.projectName = name;
    }
    
    /**
     * Event: Input id
     */
    onInputId(id) {
        this.state.projectId = id;
    }
}

module.exports = CreateProject;
