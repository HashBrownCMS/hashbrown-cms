'use strict';

module.exports = function(view) { return `

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width initial-scale=1">
    <meta name="description" content="A free and open-source headless CMS">
    <meta name="robots" content="noindex, nofollow, noarchive, nosnippet">
    <link href="/favicon.png?v=2" rel="icon" type="image/png">
    <link href="/lib/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <link href="/css/client.css" rel="stylesheet">
    <title>HashBrown CMS</title>
</head>

<body class="page page--login">
    <form class="page--login__login" data-invite-token="">
        <div class="page--login__login__heading"><img class="page--login__logo" src="/svg/logo_pink.svg">
            <h2>HashBrown</h2>
        </div>
        <div class="page--login__login__body"><input class="widget widget--input tall expanded text" type="text" id="username" placeholder="Username"><input class="widget widget--input tall expanded text" type="password" id="password" placeholder="Password"><input class="widget widget--button expanded" type="submit" value="Login"></div>
    </form>
    <script src="/js/browser-check.js"></script>
    <script src="/lib/jquery/jquery.min.js"></script>
    <script src="/js/login.js"></script>
</body>

`};
