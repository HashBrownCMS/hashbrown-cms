'use strict';

module.exports = function(_, view) { return `

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width initial-scale=1">
    <meta name="description" content="A free and open-source headless CMS">
    <meta name="robots" content="noindex, nofollow, noarchive, nosnippet">
     
    <link href="/favicon.png?v=2" rel="icon" type="image/png">
    <link href="/lib/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <link href="/lib/normalize/normalize.css" rel="stylesheet">
    <link href="/css/client.css" rel="stylesheet">

    <title>HashBrown CMS</title>
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

    <script src="/js/browser-check.js"></script>

    <script src="/lib/jquery/jquery.min.js"></script>
    <script src="/js/setup.js"></script>
</body>

`}
