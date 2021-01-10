'use strict';

module.exports = (_, model) => `

<!DOCTYPE html>
<html>
    <head>
        ${require('./inc/head')(_, model)}
    </head>

    <body class="page page--environment">
        <main class="page--environment__spaces">
            <input type="checkbox" autocomplete="off" class="page--environment__space--nav__toggle" id="page--environment__space--nav__toggle">
            <label class="page--environment__space--nav__switch" for="page--environment__space--nav__toggle"></label>
            <div class="page--environment__space page--environment__space--menu"></div>
            <div class="page--environment__space page--environment__space--nav"></div>
            <div class="page--environment__space page--environment__space--editor"></div>
        </main>

        ${require('./inc/scripts')(_, model)}
            
        <script>
            window.HashBrown = {};
            HashBrown.Client = {
                context: ${JSON.stringify(model.context)},
                themes: ${JSON.stringify(model.themes)}
            };
        </script>

        <script src="${model.context.config.system.rootUrl}/js/service.js"></script>
        <script src="${model.context.config.system.rootUrl}/js/entity.js"></script>
        <script src="${model.context.config.system.rootUrl}/js/controller.js"></script>
        
        <script src="${model.context.config.system.rootUrl}/js/environment.js"></script>
        <script src="${model.context.config.system.rootUrl}/js/plugins.js"></script>
    </body>
</html>

`
