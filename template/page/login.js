'use strict';

module.exports = (_, model) => `

<!DOCTYPE html>
<html>
    <head>
        ${require('./inc/head')(_, model)}
    </head>

    <body class="page page--login logo centered">
        ${model.message ? `
            <div class="widget widget--message fixed fixed--top warn">
                ${model.message}
            </div>
        ` : ''}
        
        <form class="page--login__login">
            <input class="widget widget--text large" name="username" type="text" placeholder="Username">
            <input class="widget widget--text large" name="password" type="password" placeholder="Password">
            <input class="widget widget--button expanded" type="submit" value="Login">
        </form>
        
        ${require('./inc/scripts')(_, model)}

        <script>
            window.HashBrown = {};
            HashBrown.Context = {
                rootUrl: "${model.rootUrl}"
            };
        </script>
        
        <script src="${model.rootUrl}/js/common.js"></script>
        <script src="${model.rootUrl}/js/service.js"></script>
        <script src="${model.rootUrl}/js/login.js"></script>
    </body>
</html> 

`
