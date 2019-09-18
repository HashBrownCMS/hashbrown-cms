'use strict';

module.exports = (_, view) => `

<!DOCTYPE html>
<html>
    <head>
        ${require('./inc/head')(_, view)}
    </head>

    <body class="page page--login logo centered">
        <form class="page--login__login">
            <input class="widget widget--input tall expanded text" name="username" type="text" placeholder="Username">
            <input class="widget widget--input tall expanded text" name="password" type="password" placeholder="Password">
            <input class="widget widget--button expanded" type="submit" value="Login">
        </form>
        
        ${require('./inc/scripts')(_, view)}

        <script src="/js/common.js"></script>
        <script src="/js/service.js"></script>
        <script src="/js/login.js"></script>
    </body>
</html> 

`
