'use strict';

/**
 * The client side helper class for Forms
 */
class FormHelper {
    /**
     * Gets all Forms
     */
    static getAllForms() {
        return HashBrown.Helpers.ResourceHelper.get(HashBrown.Models.Form, 'forms');
    }
}

module.exports = FormHelper;
