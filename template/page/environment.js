'use strict';

module.exports = (_, model) => `

<!DOCTYPE html>
<html>
    <head>
        ${require('./inc/head')(_, model)}
    </head>

    <body class="page page--environment">
        ${require('./inc/spinner')(_, model)}
        
        <main class="page--environment__spaces">
            <div class="page--environment__space page--environment__space--menu"></div>
            <div class="page--environment__space page--environment__space--nav"></div>
            <div class="page--environment__space page--environment__space--editor"></div>
        </main>

        ${require('./inc/scripts')(_, model)}
            
        <script>
            window.HashBrown = {};
            HashBrown.Context = {
                rootUrl: "${model.rootUrl}",
                project: ${JSON.stringify(model.currentProject)},
                environment: '${model.currentEnvironment}',
                user: ${JSON.stringify(model.user)},
                themes: ${JSON.stringify(model.themes)}
            };
        </script>

        <script src="${model.rootUrl}/js/common.js"></script>
        <script src="${model.rootUrl}/js/service.js"></script>
        <script src="${model.rootUrl}/js/entity.js"></script>
        <script src="${model.rootUrl}/js/utilities.js"></script>
        
        <script src="${model.rootUrl}/js/environment.js"></script>
        <script src="${model.rootUrl}/js/plugins.js"></script>
    </body>
</html>

`
