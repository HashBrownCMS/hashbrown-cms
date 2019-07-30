'use strict';

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
        
        this.fetch();
    }

    /**
     * Event: Click save
     */
    async onClickSave() {
        try {
            await HashBrown.Helpers.LanguageHelper.setLanguages(this.model.id, this.model.settings.languages);

            this.close();

            this.trigger('change');

        } catch(e) {
            UI.errorModal(e);
                
        }
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
                value: this.model.settings.languages,
                useTypeAhead: true,
                useMultiple: true,
                options: HashBrown.Helpers.LanguageHelper.getLanguageOptions(this.model.id),
                onChange: (newValue) => {
                    this.model.settings.languages = newValue;
                }
            }).$element
        );
    }
}

module.exports = LanguageEditor;
