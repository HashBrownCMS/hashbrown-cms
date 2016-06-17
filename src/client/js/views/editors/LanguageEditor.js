'use strict';

/**
 * A field editor for specifying one of the selected languages
 */
class LanguageEditor extends View {
    constructor(params) {
        super(params);

        this.fetch();
    }

    /**
     * Event: Change value
     */ 
    onChange() {
        this.value = this.$select.val();

        this.trigger('change', this.value);
    }
    
    render() {
        this.$element = _.div({class: 'field-editor dropdown-editor'},
            this.$select = _.select({class: 'form-control'},
                _.each(this.config.options, (i, option) => {
                    return _.option({
                        value: option.value,
                        selected: this.value == option.value
                    }, option.label);
                })
            ).change(() => { this.onChange(); })
        );

        LanguageHelper.getSelectedLanguages()
        .then((languages) => {
            _.append(this.$select,
                _.each(languages, (i, language) => {
                    return _.option({value: language}, language);
                })
            );

            this.$select.val(this.value);
        });
    }
}

module.exports = LanguageEditor;
