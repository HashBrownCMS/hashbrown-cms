'use strict';

module.exports = (_, view) => `

<!DOCTYPE html>
<html>
    <head>
        ${require('./inc/head')(_, view)}
    </head>

    <body class="page.page--environment">
        <main class="page--environment__spaces">
            <div class="page--environment__space page--environment__space--menu"></div>
            <div class="page--environment__space page--environment__space--nav"></div>
            <div class="page--environment__space page--environment__space--editor"></div>
        </main>
        
        ${require('./inc/scripts')(_, view)}
            
        <script>
            window.HashBrown = {};
            HashBrown.Context = {
                project: {
                    id: 'demo',
                    settings: {
                        name:'Demo',
                        languages: ['en'],
                        sync: {}
                    }
                },
                environment: 'live',
                user: {id:'demouser',isAdmin:true,username:'demouser',fullName:'Demo user',scopes:{}},
                isMediaPicker: location.href.indexOf('?isMediaPicker=true') > -1,
                isDemo: true
            };
        </script>

        <script src="/js/common.js"></script>
        <script src="/js/service.js"></script>
        <script src="/js/entity.js"></script>
        <script src="/js/utilities.js"></script>
        
        <script src="/js/environment.js"></script>
        <script src="/js/demo.js"></script>
    </body>
</html>

`
