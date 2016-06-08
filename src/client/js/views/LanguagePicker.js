'use strict';

class LanguagePicker extends View {
    constructor(params) {
        super(params);

        this.fetch();
    }
    
    /**
     * Event: On change language
     */
    onChangeLanguage(e) {
        e.preventDefault();

        localStorage.setItem('language', $(this).text());

        location.reload();
    }

    render() {
        this.$element = _.div({class: 'language-picker dropdown'},
            _.button({class: 'btn btn-default dropdown-toggle', 'data-toggle': 'dropdown'},
                window.language
            ),
            _.ul({class: 'dropdown-menu'})
        );

        LanguageHelper.getSelectedLanguages()
        .then((languages) => {
            this.$element.find('.dropdown-menu').html(
                _.each(
                    languages.filter((language) => {
                        return language != window.language;
                    }), (i, language) => {
                    return _.li({value: language},
                        _.a({href: '#'},
                            language
                        ).click(this.onChangeLanguage)
                    );
                })
            );
        });
    }
}

module.exports = LanguagePicker;
