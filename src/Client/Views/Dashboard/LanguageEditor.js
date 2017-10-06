'use strict';

const MessageModal = require('Client/Views/Modals/MessageModal');
const LanguageHelper = require('Client/Helpers/LanguageHelper');

/**
 * The language settings editor
 *
 * @memberof HashBrown.Client.Views.Dashboard
 */
class LanguageEditor extends Crisp.View {
    constructor(params) {
        super(params);

        this.modal = new MessageModal({
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

        LanguageHelper.getLanguages(this.projectId)
        .then((selectedLanguages) => {
            this.model = selectedLanguages;

            _.append(this.$element.find('.modal-body').empty(),
                UI.inputChipGroup(this.model, LanguageHelper.getLanguageOptions(this.projectId), true)
            );

            this.fetch();
        });
    }

    /**
     * Event: Click save
     */
    onClickSave() {
        LanguageHelper.setLanguages(this.projectId, this.model)
        .then(() => {
            this.modal.hide();

            this.trigger('change', this.model);
        })
        .catch(UI.errorModal);
    }
}

module.exports = LanguageEditor;
