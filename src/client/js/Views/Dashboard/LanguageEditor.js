'use strict';

/**
 * The language settings editor
 *
 * @class View LanguageEditor
 */
class LanguageEditor extends View {
    constructor(params) {
        super(params);

        this.modal = new HashBrown.Views.Modals.MessageModal({
            model: {
                class: 'language-settings settings-modal',
                title: 'Languages'
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default'
                },
                {
                    label: 'Save',
                    class: 'btn-primary',
                    callback: () => {
                        this.onClickSave();

                        return false;
                    }
                }
            ]
        });

        this.$element = this.modal.$element;

        HashBrown.Helpers.LanguageHelper.getSelectedLanguages(this.projectId)
        .then((selectedLanguages) => {
            this.model = selectedLanguages;

            this.fetch();
        });
    }

    /**
     * Event: Click save
     */
    onClickSave() {
        HashBrown.Helpers.LanguageHelper.setLanguages(this.projectId, this.model)
        .then(() => {
            this.modal.hide();

            this.trigger('change', this.model);
        })
        .catch(UI.errorModal);
    }

    render() {
        _.append(this.$element.find('.modal-body').empty(),
            UI.inputChipGroup(this.model, HashBrown.Helpers.LanguageHelper.getLanguages(this.projectId), true)
        );
    } 
}

module.exports = LanguageEditor;
