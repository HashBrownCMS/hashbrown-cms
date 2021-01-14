# Plugins

How to extend HashBrown with further functionality

## Installing

HashBrown has a couple of [official plugins](https://github.com/HashBrownCMS)

To add a plugin to your instance, just clone it to your `/plugins` folder, execute `npm run build:frontend` and restart HashBrown.

## Schemas

Apart from providing additional programmatical functionality to HashBrown, plugins can also contain built-in schemas!

To add a schema to your plugin, place a `MySchema.json` file in the `/my-plugin/schema/[content|field]` folder, depending on which type of schema you're providing.

The schemas can be written in 2 formats, the native HashBrown format or the [uischema.org](https://uischema.org) format.

A native schema format could look like this (lean, but only works in HashBrown):

```
{
    "name": "Page",
    "customIcon": "file",
    "config": {
        "title": {
            "label": "Description",
            "schemaId": "string",
            "isLocalized": true
        },
        "description": {
            "label": "Description",
            "schemaId": "string",
            "isLocalized": true
        },
        "url": {
            "label": "URL",
            "schemaId": "url",
            "isLocalized": true
        }
    }
}
```

A uischema.org format could look like this (more verbose, but works in any other application supporting this format, and supports localisation):

```
{
    "@type": "Page",
    "@config": {
        "customIcon": "file"
    },  
    "title": {
        "@type": "Text",
        "@config": {
            "isLocalized": true
        }
    },  
    "description": {
        "@type": "Text",
        "@config": {
            "isLocalized": true
        }
    },  
    "url": {
        "@type": "URL",
        "@config": {
            "isLocalized": true
        }
    },  
    "@i18n": {
        "en": {
            "@name": "Page",
            "title": {
                "@name": "Title"
            },
            "description": {
                "@name": "Description"
            },
            "url": {
                "@name": "URL"
            }
        }
    }   
}
```

## Structure

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

## Development

Plugins follow the same file and namespace structure as the main codebase.

When developing plugins, use `npm run watch:frontend` to compile client-side code and `npm run watch:nodemon` or `npm run watch:docker` for server-side code.

When using Docker, issue the command `touch package.json` to reload the daemon (you might have to exit and re-enter the `npm run watch:docker` command depending on your OS).
