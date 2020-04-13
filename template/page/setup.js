'use strict';

module.exports = (_, model) => `

<!DOCTYPE html>
<html>
    <head>
        ${require('./inc/head')(_, model)}
    </head>

    <body class="page page--setup centered logo">
        ${model.message ? `
            <div class="widget widget--message fixed fixed--top warn">
                ${model.message}
            </div>
        ` : ''}

        <form class="page--setup__step" method="POST">
            <h1>Create your first admin account</h1>
            <input class="widget widget--text large" required title="Your username" type="text" name="username" placeholder="Username">
            <input class="widget widget--text large" required title="Your password" type="password" name="password" placeholder="Password">
            <input class="widget widget--button expanded" type="submit" value="Next">
        </form>

        ${require('./inc/scripts')(_, model)}
        
        <script>
            window.HashBrown = {};
            HashBrown.Context = {
                rootUrl: "${model.rootUrl}"
            };
        </script>
        
        <script src="${model.rootUrl}/js/setup.js"></script>
    </body>
</html>

`
