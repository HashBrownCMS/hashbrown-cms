'use strict';

class FieldEditor extends View {
    /**
     * Renders a field preview template
     *
     * @returns {HTMLElement} Element
     */
    renderPreview() {
        if(!this.schema || !this.schema.previewTemplate) { return null; }

        let $element = _.div({class: 'field-preview'});
        let template = this.schema.previewTemplate;
        let regex = /\${([\s\S]+?)}/g;
        let field = this.value;

        let html = template.replace(regex, (key) => {
            // Remove braces first
            key = key.replace('${ ', '').replace('${', '');
            key = key.replace(' }', '').replace('}', '');

            // Find result
            let result = '';

            try {
                result = eval("'use strict'; " + key);
            } catch(e) {
                // Ignore failed eval, the values are just not set yet
                result = e.message;
            }

            if(result && result._multilingual) {
                result = result[window.language];
            }

            return result || '';
        });

        $element.append(
			_.div({class: 'field-preview-toolbar'},
				_.button({class: 'btn raised btn-primary'}, 'Edit')
					.click(() => {
						$element.toggleClass('editing');
					})
			),
			html
		);

        return $element;
    }
}

module.exports = FieldEditor;
