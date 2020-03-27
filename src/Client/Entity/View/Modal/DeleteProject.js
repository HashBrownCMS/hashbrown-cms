'use strict';

/**
 * The modal for deleting projects
 *
 * @memberof HashBrown.Client.Entity.View.Modal
 */
class DeleteProject extends HashBrown.Entity.View.Modal.ModalBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/modal/deleteProject');
    }

    /**
     * Event: Clicked delete
     */
    async onClickDelete() {
        try {
            await HashBrown.Service.RequestService.request('delete', 'projects/' + this.model.id);

            this.trigger('change');

            this.close();

        } catch(e) {
            this.setErrorState(e);

        }
    }
        
    /**
     * Event: Input name
     */
    onInputName(projectName) {
        let btn = this.element.querySelector('.modal__footer .widget--button');
        let isMatch = projectName == this.model.getName();

        btn.classList.toggle('disabled', !isMatch);
    }
}

module.exports = DeleteProject;
