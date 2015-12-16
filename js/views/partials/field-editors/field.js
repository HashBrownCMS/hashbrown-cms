'use strict';

class FieldEditor extends View {
    constructor(args) {
        super(args);
       
        // Register events
        this.on('changeTextValue', this.onChangeTextValue);
        this.on('changeBoolValue', this.onChangeBoolValue);
    }

    onChangeTextValue(e, element, view) {
        if(view.model.isArray) {
            let i = $(element).parents('.field-editor').index();
                
            view.model.value[i] = $(element).val();

        } else {
            view.model.value = $(element).val();
        
        }

        view.trigger('change');
    }
    
    onChangeBoolValue(e, element, view) {
        if(view.model.isArray) {
            let i = $(element).parents('.field-editor').index();
                
            view.model.value[i] = $(element).data('checked') || false;

        } else {
            view.model.value = $(element).data('checked');
        
        }

        view.trigger('change');
    }

    renderField() {
    
    }

    render() {
        let view = this;

        if(this.model.isArray) {
            function onClickAdd() {
                view.model.value = view.model.value || [];

                $(this).before(
                    addField(view.model.value.length, null)
                );

                view.model.value.push(null);
            }
            
            function addField(i, value) {
                function onClickRemove() {
                    if(view.model.value.length > 1) {
                        $field.remove();
                        $btnRemove.remove();
                        view.model.value.splice(i, 1);
                    }
                }

                let $field = view.renderField(value);

                let $btnRemove = _.span({class: 'input-group-btn'},
                    _.button({class: 'btn btn-danger'}, [
                        _.span({class: 'glyphicon glyphicon-remove'})
                    ]).click(onClickRemove)
                );

                return _.div({class: 'field-editor input-group'}, [
                    $btnRemove,
                    $field
                ]);
            }

            if(!this.model.value || this.model.value.length < 1) {
                this.model.value = [ null ];
            }

            this.$element = _.div({class: 'field-editor-array'},
                _.each(this.model.value, addField)
            );

            this.$element.append(
                _.button({class: 'btn btn-success'},
                    _.span({class: 'glyphicon glyphicon-plus'})
                ).click(onClickAdd)
            );
        
        } else {
            this.$element = _.div({class: 'field-editor'},
                this.renderField(this.model.value)
            );
        
        }
    }
}

module.exports = FieldEditor;
