'use strict';

class LanguageSettings extends View {
    constructor(params) {
        super(params);

        this.fetch();
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
                                    class: 'form-control switch',
                                    type: 'checkbox',
                                    checked: selectedLanguages.indexOf(language) > -1
                                }),
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
