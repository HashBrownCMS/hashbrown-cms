# HashBrown CMS
A free and open-source headless CMS built with Node.js and MongoDB

## Getting started
- [Guides](http://hashbrowncms.org/guides)
- [API documentation](http://hashbrowncms.org/docs/api)
- [Developer documentation](http://hashbrowncms.org/docs/src)

## Installing and running HashBrown
First make sure you have these dependencies met:  
- node.js
- mongodb
- imagemagick
- optional:
  - docker & docker-compose
  - nodemon

Then clone the code and install the dependencies:  
```
git clone https://github.com/HashBrownCMS/hashbrown-cms.git --recursive
cd ./hashbrown-cms
npm install
```

Building and starting the server for production:
```
npm start
```

Building/watching frontend files:
```
npm run build:frontend
npm run watch:frontend
```

Using Docker:
```
npm run start:docker
npm run restart:docker
npm run watch:docker
npm run stop:docker
```

Using nodemon:
```
npm run watch:nodemon
```

## Updating HashBrown
To update the core HashBrown version and all of its dependencies:
```
npm run update
```

Or manually:
```
cd /to/your/hashbrown/dir
git pull
git submodule update --recursive --init
npm install
webpack 
```

Remember to stop and restart the server afterwards.

## Configuring MongoDB  
Using environment variables:
  - `MONGODB_HOST`: host(s), split by comma, default value is `localhost`
  - `MONGODB_PORT`: port(s), split by comma
  - `MONGODB_USERNAME`: username
  - `MONGODB_PASSWORD`: password
  - `MONGODB_PREFIX`: database name prefix, default value is `hb_`
  - `MONGODB_OPTIONS`: connection options, JSON string containing key/value pairs.

Using `/config/database.cfg`
```
{
  "host": "host" | ["host1", "host2"] | "host1,host2",
  "port": "port" | [port1, port2] | "port1,port2",
  "username": "<username>",
  "password": "<password>",
  "prefix": "<database name prefix>",
  "options": {
    "<key>": "<value>",
    ...
  }
}
```

## Plugins
The folder structure for plugins is like this:

```
/plugins
  /[plugin-name]
    package.json
    /src
      /Client
        /index.js
      /Server
        /index.js
```

Plugins follow the same file and namespace structure as the main codebase. When developing plugins, use `npm run watch:frontend` to compile client-side code and `npm run watch:nodemon` or `npm run watch:docker` for server-side code. When using Docker, you can issue the command `touch package.json` to reload the daemon (you might have to exit and re-enter the `npm run watch:docker` command depending on your OS).

## Contribute
If you'd like to contribute to HashBrown development, you can make a pull request to [our repo](https://github.com/HashBrownCMS/hashbrown-cms) or contact us about becoming a collaborator

## Talk to us
Matrix: #hashbrowncms:matrix.org

## Report issues
If you have questions, bug reports or anything else of the sort, please use the [issue tracker](https://github.com/Putaitu/hashbrown-cms/issues)
