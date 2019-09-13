'use strict';

module.exports = (_, view) => `

<!DOCTYPE html>
<html>
    <head>
        ${require('./inc/head')(_, view)}
    </head>

    <body class="page page--setup">
        ${_.if(view.message, `
            <div class="widget widget--message fixed fixed--top warning">
                ${view.message}
            </div>
        `)}

        <form class="page--setup__step page--setup__step-${view.step}" data-step="${view.step} action="/api/users/first">
            <div class="page--setup__step__heading">
                <h2>Create your first admin account</h2>
            </div>
            <div class="page--setup__step__body">
                <input class="widget widget--input tall expanded text" required title="Your username" type="text" name="username" placeholder="Username">
                <input class="widget widget--input tall expanded text" required title="Your password" type="password" name="password" placeholder="Password">
                
                <input class="widget.widget--button expanded" type="submit" value="Next">
            </div>
        </form>

        ${require('./inc/scripts')(_, view)}
        
        <script src="/js/setup.js"></script>
    </body>
</html>

`
