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
    
    <title>Error - HashBrown</title>
</head>

<body class="page page--error">
    <h2 class="page--error__title">Error</h2>
    
    <div class="widget widget--message warning large">
        ${view.message || 'An unspecified error occurred'}
    </div>

    <a class="widget widget--button tall" href="/">Go to dashboard</a>
</body>

`}
