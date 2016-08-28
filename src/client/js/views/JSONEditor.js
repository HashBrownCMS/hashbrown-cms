'use strict';

// Lib
let beautify = require('js-beautify').js_beautify;

// Views
let MessageModal = require('./MessageModal');

/**
 * A basic JSON editor for any object
 */
class JSONEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'json-editor flex-vertical'});
        this.$error = _.div({class: 'panel panel-danger'},
            _.div({class: 'panel-heading'}),
            _.div({class: 'panel-body'})
        ).hide();

        this.fetch();
    }

    /**
     * Event: Successful API call
     */
    onSuccess() {
    
    }

    /**
     * Event: Failed API call
     */
    onError(e) {
        alert(e);
    }

    /**
     * Event: Click basic. Returns to the regular editor
     */
    onClickBasic() {
        let url = $('.navbar-main .pane-container.active .pane-item-container.active .pane-item').attr('href');
    
        if(url) {
            location = url;
        } else {
            debug.log('Invalid url "' + url + '"', this);
        }
    }

    /**
     * Event: Click save. Posts the model to the apiPath
     */
    onClickSave() {
        let view = this;

        try {
            this.model = JSON.parse(this.value);

            apiCall('post', this.apiPath, this.model)
            .then(this.onSuccess)
            .catch(this.onError);

        } catch(e) {
            new MessageModal({
                model: {
                    title: 'Invalid JSON',
                    body: e
                }
            });

        }
    }

    /**
     * Event: Click beautify button
     */
    onClickBeautify() {
        try {
            this.value = beautify(this.value);
            this.$element.find('textarea').val(this.value);
        
        } catch(e) {
            this.$error.children('.panel-heading').html('JSON error');
            this.$error.children('.panel-body').html(e);
            this.$error.show();

        }
    }

    /**
     * Event: Change text. Make sure the value is up to date
     */
    onChangeText($textarea, e) {
        this.value = $textarea.val();

        try {
            this.model = JSON.parse(this.value);
            this.$error.hide();

        } catch(e) {
            this.$error.children('.panel-heading').html('JSON error');
            this.$error.children('.panel-body').html(e);
            this.$error.show();
        }
    }

    render() {
        this.value = beautify(JSON.stringify(this.model));

        this.$element.html([
            _.textarea({class: 'flex-expand', disabled: this.model.locked},
                this.value
            )
            .on('keydown', (e) => { if(e.which == 9) { e.preventDefault(); return false; } })
            .on('keyup change propertychange paste', (e) => { return this.onChangeText(this.$element.find('textarea'), e); }),
            this.$error,
            _.div({class: 'panel panel-default panel-buttons'}, 
                _.button({class: 'btn btn-default btn-raised'},
                    _.span('{ }')
                ).click(() => { this.onClickBeautify(); }),
                _.div({class: 'btn-group'},
                    _.button({class: 'btn btn-embedded'},
                        'Basic'
                    ).click(() => { this.onClickBasic(); }),
                    _.if(!this.model.locked,
                        _.button({class: 'btn btn-raised btn-success'},
                            'Save '
                        ).click(() => { this.onClickSave(); })
                    )
                )
            )
        ]);
    }
}

module.exports = JSONEditor;
