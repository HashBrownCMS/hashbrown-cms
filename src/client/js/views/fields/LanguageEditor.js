'use strict';

const FieldEditor = require('./FieldEditor');

/**
 * A field editor for specifying one of the selected languages
 */
class LanguageEditor extends FieldEditor {
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
            // Render preview
            this.renderPreview(),

            this.$select = _.select({class: 'form-control'}).change(() => { this.onChange(); })
        );

        LanguageHelper.getSelectedLanguages(ProjectHelper.currentProject)
        .then((languages) => {
            _.append(this.$select,
                _.each(languages, (i, language) => {
                    return _.option({value: language}, language);
                })
            );

            // Null check
            if(!this.value) {
                if(languages.length > 0) {
                    this.value = languages[0];

                    // Apply changes on next CPU cycle
                    setTimeout(() => {
                        this.trigger('change', this.value);
                    }, 1);
                
                } else {
                    debug.warning('No selected languages were found', this);

                }
            }

            this.$select.val(this.value);
        });
    }
}

module.exports = LanguageEditor;
