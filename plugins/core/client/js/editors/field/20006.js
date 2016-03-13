resources.editors['20006'] = function(params) {
    var editor = this;

    this.onChange = function onChange() {
        params.onChange(this.$select.val());
    };

    this.$element = _.div({class: 'field-editor input-group page-reference-editor'}, [
        this.$select = _.select({class: 'form-control'},
            _.each(window.resources.pages, function(id, page) {
                return _.option({value: page.id}, page.title);
            })
        ).change(function() { editor.onChange(); }),
        _.div({class: 'input-group-btn'}, 
            this.$clearBtn = _.button({class: 'btn btn-primary'},
                'Clear'
            )
        )
    ]);

    this.$select.val(params.value);

    this.$clearBtn.click(function() {
        editor.$select.val(null);
        
        editor.onChange();
    });
};
