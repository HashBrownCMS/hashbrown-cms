'use strict';

/**
 * The language settings editor
 *
 * @class View LanguageSettings
 */
class LanguageSettings extends View {
    constructor(params) {
        super(params);
        
        this.$element = _.div({class: 'editor language-settings'});

        LanguageHelper.getSelectedLanguages()
        .then((selectedLanguages) => {
            this.model = selectedLanguages;

            this.fetch();
        });
    }

    /**
     * Event: Click save
     */
    onClickSave() {
        this.$saveBtn.toggleClass('working', true);

        LanguageHelper.setLanguages(this.model)
        .then(() => {
            this.$saveBtn.toggleClass('working', false);
        })
        .catch(UI.errorModal);
    }

    render() {
        _.append(this.$element.empty(),
            _.div({class: 'editor-header'},
                _.span({class: 'fa fa-flag'}),
                _.h4('Languages')
            ),
            _.div({class: 'editor-body'},
                UI.inputChipGroup(this.model, LanguageHelper.getLanguages(), true)
            ),
            _.div({class: 'editor-footer panel panel-default panel-buttons'}, 
                _.div({class: 'btn-group'},
                    this.$saveBtn = _.button({class: 'btn btn-primary btn-raised btn-save'},
                        _.span({class: 'text-default'}, 'Save '),
                        _.span({class: 'text-working'}, 'Saving ')
                    ).click(() => { this.onClickSave(); }),
                )
            )
        );
    } 
}

module.exports = LanguageSettings;
