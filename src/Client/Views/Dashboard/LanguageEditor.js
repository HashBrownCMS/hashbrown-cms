'use strict';

const LanguageHelper = require('Client/Helpers/LanguageHelper');

/**
 * The language settings editor
 *
 * @memberof HashBrown.Client.Views.Dashboard
 */
class LanguageEditor extends HashBrown.Views.Modals.Modal {
    constructor(params) {
        params.title = 'Languages';
        params.actions = [
            {
                label: 'Cancel',
                class: 'default'
            },
            {
                label: 'Save',
                onClick: () => {
                    this.onClickSave();

                    return false;
                }
            }
        ];

        super(params);
        
        LanguageHelper.getLanguages(this.projectId)
        .then((selectedLanguages) => {
            this.model = selectedLanguages || [];
            
            this.fetch();
        });
    }

    /**
     * Event: Click save
     */
    onClickSave() {
        LanguageHelper.setLanguages(this.projectId, this.model)
        .then(() => {
            this.close();

            this.trigger('change', this.model);
        })
        .catch(UI.errorModal);
    }

    /**
     * Renders the modal body
     *
     * @returns {HTMLElement} Body
     */
    renderBody() {
        return new HashBrown.Views.Widgets.Dropdown({
            value: this.model,
            useTypeAhead: true,
            useMultiple: true,
            options: LanguageHelper.getLanguageOptions(this.projectId)
        }).$element;
    }
}

module.exports = LanguageEditor;
