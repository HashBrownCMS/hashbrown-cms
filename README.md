# HashBrown CMS

A free and open-source headless CMS built with Node.js and MongoDB
Multiple projects and environments are a fundamental part of HashBrown's structure, so you only need one CMS for all of your website needs.

## Guides

We have a few guides on using HashBrown CMS [here](https://github.com/HashBrownCMS/hashbrown-cms/wiki)

## Running and installing

### Docker

The easiest way to get up and running is to use the HashBrown CMS [Docker images](https://hub.docker.com/r/hashbrowncms/hashbrowncms/tags). An example setup can be found [here](https://hashbrowncms.org/guides/docker).

The `latest` and `develop` images will automatically update themselves every time they're restarted.

### Installing

First make sure you have these dependencies met:  
- node.js
- mongodb
- imagemagick
- optional:
  - docker & docker-compose
  - nodemon

Then clone the code and install the dependencies:  
```
git clone https://github.com/HashBrownCMS/hashbrown-cms.git
cd ./hashbrown-cms
npm install
```

### Running

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
npm run db:docker
```

Using nodemon:
```
npm run watch:nodemon
```

### Updating

To update the core HashBrown version and all of its dependencies:

```
npm run update
```

Or manually:
```
cd /to/your/hashbrown/dir
git pull
npm install
webpack 
```

Remember to stop and restart the server afterwards.

## Contribute

If you'd like to contribute to HashBrown development, you can make a pull request to [our repo](https://github.com/HashBrownCMS/hashbrown-cms) or contact us about becoming a collaborator

## Report issues

If you have questions, bug reports or anything else of the sort, please use the [issue tracker](https://github.com/HashBrownCMS/hashbrown-cms/issues)
