'use strict';

/**
 * The client side helper class for Forms
 */
class FormHelper {
    /**
     * Gets all Forms
     */
    static getAllForms() {
        return HashBrown.Helpers.ResourceHelper.getAll(HashBrown.Models.Form, 'forms');
    }
}

module.exports = FormHelper;
