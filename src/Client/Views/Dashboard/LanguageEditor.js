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
                label: 'Save',
                onClick: () => {
                    this.onClickSave();

                    return false;
                }
            }
        ];

        params.autoFetch = false;

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

            this.trigger('change');
        })
        .catch(UI.errorModal);
    }

    /**
     * Renders the modal body
     *
     * @returns {HTMLElement} Body
     */
    renderBody() {
        return _.div({class: 'widget-group'},
            _.label({class: 'widget widget--label'}, 'Selected languages'),
            new HashBrown.Views.Widgets.Dropdown({
                value: this.model,
                useTypeAhead: true,
                useMultiple: true,
                options: LanguageHelper.getLanguageOptions(this.projectId),
                onChange: (newValue) => {
                    this.model = newValue;
                }
            }).$element
        );
    }
}

module.exports = LanguageEditor;
