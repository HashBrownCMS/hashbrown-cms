'use strict';

module.exports = (_, view) => `

<!DOCTYPE html>
<html>
    <head>
        ${require('./inc/head')(_, view)}
    </head>

    <body>
        <div class="preview-banner">Preview</div>

        <iframe src="${view.previewUrl}"></iframe>
    </body>
</html>

`
