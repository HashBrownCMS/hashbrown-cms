'use strict';

module.exports = (_, view) => `

<!DOCTYPE html>
<html>
    <head>
        ${require('./inc/head')(_, view)}
    </head>

    <body class="page page--setup centered logo">
        ${_.if(view.message, `
            <div class="widget widget--message fixed fixed--top warning">
                ${view.message}
            </div>
        `)}

        <form class="page--setup__step" data-step="${view.step}" action="/api/users/first">
            <h1>Create your first admin account</h1>
            <input class="widget widget--text large" required title="Your username" type="text" name="username" placeholder="Username">
            <input class="widget widget--text large" required title="Your password" type="password" name="password" placeholder="Password">
            <input class="widget widget--button expanded" type="submit" value="Next">
        </form>

        ${require('./inc/scripts')(_, view)}
        
        <script src="/js/setup.js"></script>
    </body>
</html>

`
