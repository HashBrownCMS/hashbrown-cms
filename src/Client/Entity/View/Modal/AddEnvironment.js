'use strict';

/**
 * The modal for adding environments to projects
 *
 * @memberof HashBrown.Client.Entity.View.Modal
 */
class AddEnvironment extends HashBrown.Entity.View.Modal.ModalBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/modal/addEnvironment');
    }

    /**
     * Event: Clicked add
     */
    async onClickAdd() {
        try {
            if(!this.state.environmentName || this.state.environmentName.length < 2) {
                throw new Error('The environment name is too short');
            }

            await HashBrown.Service.RequestService.request('put', 'server/projects/' + this.model.id + '/' + this.state.environmentName)

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
        this.state.environmentName = name;
    }
}

module.exports = AddEnvironment;
