'use strict';

/**
 * The client side helper class for Forms
 */
class FormService {
    /**
     * Gets all Forms
     *
     * @return {Array} Forms
     */
    static getAllForms() {
        return HashBrown.Service.ResourceService.getAll(HashBrown.Entity.Resource.Form, 'forms');
    }
    
    /**
     * Gets a Form by id
     *
     * @param {String} id
     *
     * @return {HashBrown.Entity.Resource.Form} Form
     */
    static getFormById(id) {
        return HashBrown.Service.ResourceService.get(HashBrown.Entity.Resource.Form, 'forms', id);
    }
    
    /**
     * Starts a tour of the Forms section
     */
    static async startTour() {
        if(location.hash.indexOf('forms/') < 0) {
            location.hash = '/forms/';
        }
       
        await new Promise((resolve) => { setTimeout(() => { resolve(); }, 500); });
            
        await UI.highlight('.navbar-main__tab[data-route="/forms/"]', 'This the Forms section, where user submitted content lives.', 'right', 'next');

        await UI.highlight('.navbar-main__pane[data-route="/forms/"]', 'Here you will find all of your Forms. You can right click here to create a new Form.', 'right', 'next');
        
        let editor = document.querySelector('.editor--form');

        if(editor) {
            await UI.highlight('.editor--form', 'This is the Form editor, where you edit Forms.', 'left', 'next');
        } else {
            await UI.highlight('.page--environment__space--editor', 'This is where the Form editor will be when you click a Form.', 'left', 'next');
        }
    }
}

module.exports = FormService;
