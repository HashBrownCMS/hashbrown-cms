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
    <link href="/css/plugins.css" rel="stylesheet">
    <link href="/lib/codemirror/lib/codemirror.css" rel="stylesheet">

    <title>Demo - HashBrown</title>
</head>

<body class="page.page--environment">
    <main class="page--environment__spaces">
        <div class="page--environment__space page--environment__space--menu"></div>
        <div class="page--environment__space page--environment__space--nav"></div>
        <div class="page--environment__space page--environment__space--editor"></div>
    </main>

    <script src="/js/browser-check.js"></script>

    <script src="/lib/jquery/jquery.min.js"></script>
    <script src="/lib/crisp-ui/crisp-ui.js"></script>
        
    <script src="/lib/codemirror/lib/codemirror.js"></script>
    <script src="/lib/codemirror/mode/javascript/javascript.js"></script>
    <script src="/lib/codemirror/mode/markdown/markdown.js"></script>

    <script>
        window.HashBrown = {};
        HashBrown.Context = {
            projectName: 'Demo',
            projectId: 'demo',
            projectSettings: {info:{name:'Demo'},languages:['en'],sync:{}},
            environment: 'live',
            user: {id:'demouser',isAdmin:true,isCurrent:true,username:'demouser',fullName:'Demo user',scopes:{}},
            isMediaPicker: location.href.indexOf('?isMediaPicker=true') > -1,
            isDemo: true
        };
    </script>

    <script src="/js/common.js"></script>
    <script src="/js/service.js"></script>
    <script src="/js/entity.js"></script>
    <script src="/js/route.js"></script>
    <script src="/js/utilities.js"></script>
    <script src="/js/view.js"></script>
    
    <script src="/js/environment.js"></script>
    <script src="/js/plugins.js"></script>
    <script src="/js/demo.js"></script>

</body>

`}
