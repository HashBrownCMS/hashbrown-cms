# Plugins

How to extend HashBrown with further functionality

A plugin's folder structure is like this:

```
/plugins
    /[plugin-name]
        package.json
        /src
            /Client
                /index.js
            /Server
                /index.js
        /template
        /schema
            /content
            /field
```

Plugins follow the same file and namespace structure as the main codebase.

When developing plugins, use `npm run watch:frontend` to compile client-side code and `npm run watch:nodemon` or `npm run watch:docker` for server-side code.

When using Docker, issue the command `touch package.json` to reload the daemon (you might have to exit and re-enter the `npm run watch:docker` command depending on your OS).
