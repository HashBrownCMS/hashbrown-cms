'use strict';

class UploadEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'upload-editor'});

        this.fetch();
    }

    render() {
        this.$element.html(
            _.h1('Upload'),
            _.p('Please pick a feature to proceed')
        );
    }
}

module.exports = UploadEditor;
