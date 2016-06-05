'use strict';

/**
 * The language settings editor
 *
 * @class View LanguageSettings
 */
class LanguageSettings extends View {
    constructor(params) {
        super(params);

        this.fetch();
    }

    /**
     * Event: Flipped a switch
     *
     * @param {Object} element
     */
    onClickSwitch(element) {
        let checked = this.checked;
        let language = this.getAttribute('data-language');
            
        LanguageHelper.toggleLanguage(language, checked)
        .then(() => {
            console.log('[LanguageSettings] Language "' + language + '" set to ' + checked);
        });
    }

    render() {
        this.$element = _.div({class: 'language-settings'});

        LanguageHelper.getSelectedLanguages()
        .then((selectedLanguages) => {
            this.$element.html(
                _.each(LanguageHelper.getLanguages(), (i, language) => {
                    return _.div({class: 'input-group'},      
                        _.span(language),
                        _.div({class: 'input-group-addon'},
                            _.div({class: 'switch'},
                                _.input({
                                    id: 'switch-' + language,
                                    'data-language': language,
                                    class: 'form-control switch',
                                    type: 'checkbox',
                                    checked: selectedLanguages.indexOf(language) > -1
                                }).change(this.onClickSwitch),
                                _.label({for: 'switch-' + language})
                            )
                        )
                    );
                })
            );
        });
    } 
}

module.exports = LanguageSettings;
