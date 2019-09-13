'use strict';

module.exports = (_, view) => `

<!DOCTYPE html>
<html>
    <head>
        ${require('./inc/head')(_, view)}
    </head>

    <body class="page page--login">
        <form class="page--login__login" data-invite-token="">
            <div class="page--login__login__heading"><img class="page--login__logo" src="/svg/logo_pink.svg">
                <h2>HashBrown</h2>
            </div>
            <div class="page--login__login__body"><input class="widget widget--input tall expanded text" type="text" id="username" placeholder="Username"><input class="widget widget--input tall expanded text" type="password" id="password" placeholder="Password"><input class="widget widget--button expanded" type="submit" value="Login"></div>
        </form>
        
        ${require('./inc/scripts')(_, view)}

        <script src="/js/login.js"></script>
    </body>
</html> 

`
