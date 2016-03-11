resources.editors['20001'] = function(params) {
    var editor = this;

    this.$element = _.div({class: 'field-editor rich-text-editor panel panel-default'}, [
        _.div({class: 'panel-heading'}, 
            _.div({class: 'btn-group'}, [
                _.button({class: 'btn btn-default', 'data-wrap': 'strong'}, 
                    _.span({class: 'fa fa-bold'})
                ),
                _.button({class: 'btn btn-default', 'data-wrap': 'em'}, 
                    _.span({class: 'fa fa-italic'})
                )
            ])
        ),
        _.div({class: 'panel-body'},
            this.$output = _.div({class: 'rte-output', contenteditable: true})
                .bind('change propertychange keyup paste', function() {
                    editor.$textarea.val(htmlToMarkdown(editor.$output.html()));
                
                    editor.onChange();
                })
        ),
        _.div({class: 'panel-footer'},
            this.$textarea = _.textarea({class: 'form-control', type: 'text'}, 
                params.value
            ).bind('change propertychange keyup paste', function() {
                editor.$output.html(markdownToHtml(editor.$textarea.val()));

                editor.onChange();
            })
        )
    ]);

    this.onChange = function onChange() {
        params.onChange(this.$textarea.val());
    };

    this.$output.html(markdownToHtml(this.$textarea.val()));
};
