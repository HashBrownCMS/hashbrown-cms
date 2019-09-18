'use strict';

module.exports = (_, view) => `

<!DOCTYPE html>
<html>
    <head>
        ${require('./inc/head')(_, view)}
    </head>

    <body class="page page--login logo centered">
        <form class="page--login__login">
            <input class="widget widget--input tall expanded text" type="text" id="username" placeholder="Username">
            <input class="widget widget--input tall expanded text" type="password" id="password" placeholder="Password">
            <input class="widget widget--button expanded" type="submit" value="Login">
        </form>
        
        ${require('./inc/scripts')(_, view)}

        <script src="/js/login.js"></script>
    </body>
</html> 

`
