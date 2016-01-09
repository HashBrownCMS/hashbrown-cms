'use strict';

let FieldEditor = require('./field');

class TemplatePicker extends FieldEditor {
    constructor(args) {
        super(args);

        this.fetch();
    }

    renderField() {
        let view = this;

        view.model.allowed = ['dude', 'sweet']

        return _.div({class: 'template-picker'}, 
            _.div({class: 'form-control dropdown'}, [
                _.button({class: 'btn btn-default dropdown-toggle'},
                    view.model.value
                ),
                _.ul({class: 'dropdown-menu'}, 
                    _.each(view.model.allowed || [],
                        function(i, template) {
                            function onClick(e) {
                                e.preventDefault();
                                
                                view.events.changeTextValue(e);
                            }
                            
                            return _.li(
                                _.a(template)
                            );
                        }
                    )
                )
            ])
        );
    }
}

module.exports = TemplatePicker;
