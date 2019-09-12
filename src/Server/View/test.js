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

<body class="page page--dashboard">
    <header class="page--dashboard__header">
        <a class="page--dashboard__header__logo" target="_blank" href="http://hashbrown.rocks" title="Go to the HashBrown website">
            <img class="page--dashboard__header__logo__image" src="/svg/logo_pink.svg">
        </a>

        <a class="page--dashboard__header__tab ${view.tab === 'frontend' ? 'active': ''}" href="frontend">Frontend</a>

        ${_.if(view.user.isAdmin, `
            <a class="page--dashboard__header__tab ${view.tab === 'backend' ? 'active': ''}" href="backend">Backend</a>
        `)}

        <div class="page--dashboard__header__actions">
            ${_.if(view.user.isAdmin && view.tab === 'backend', `
                <button class="page--dashboard__backend-test__run widget widget--button low">Run tests</button>
            `)}

            ${_.if(view.tab === 'frontend', `
                <button class="page--dashboard__frontend-test__reset widget widget--button low">Reset tests</button>
            `)}
        </div>
    </header>

    <main class="page--dashboard__body">
        <div class="page--dashboard__body__container">
            ${_.if(view.tab === 'frontend', `
                <div class="page--dashboard__frontend-test">
                    ${require('./ui-checklist')(_, view)}
                </div>
            `)}

            ${_.if(view.user.isAdmin && view.tab === 'backend', `
                <div class="page--dashboard__backend-test">
                    <pre class="page--dashboard__backend-test__messages"></pre>
                </div>
            `)}
        </div>
    </main>

    <script src="/js/browser-check.js"></script>

    <script src="/lib/jquery/jquery.min.js"></script>
    <script src="/lib/crisp-ui/crisp-ui.js"></script>
    
    <script src="/js/common.js"></script>
    <script src="/js/service.js"></script>
    <script src="/js/entity.js"></script>
    <script src="/js/utilities.js"></script>
    
    <script src="/js/test.js"></script>

</body>

`}
