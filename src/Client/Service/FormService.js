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
     * Starts a tour of the forms section
     */
    static async startTour() {
        if(location.hash.indexOf('forms/') < 0) {
            location.hash = '/forms/';
        }
       
        await new Promise((resolve) => { setTimeout(() => { resolve(); }, 500); });
            
        await UI.highlight('.navigation--resource-browser__tab[href="#/forms/"]', 'This the forms section, where user submitted content lives.', 'right', 'next');

        await UI.highlight('.panel', 'Here you will find all of your forms. You can right click here to create a new form.', 'right', 'next');
        
        await UI.highlight('.resource-editor', 'This is the form editor, where you edit forms.', 'left', 'next');
    }
}

module.exports = FormService;
