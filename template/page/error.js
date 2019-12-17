'use strict';

module.exports = (_, view) => `

<!DOCTYPE html>
<html>
    <head>
        ${require('./inc/head')(_, view)}
    </head>

    <body class="page page--error logo centered">
        <h2 class="page--error__title">Error</h2>
        
        <div class="widget widget--message warning large">
            ${view.message || 'An unspecified error occurred'}
        </div>

        <a class="widget widget--button" href="/">Go to dashboard</a>
    </body>
</html> 

`
