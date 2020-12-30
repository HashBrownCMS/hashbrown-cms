# HashBrown CMS

A free and open-source headless CMS built with Node.js and MongoDB

![HashBrown CMS](http://hashbrowncms.org/img/screenshot.jpg)

## Getting started
- [Guides](https://hashbrowncms.org/guides)
- [API documentation](https://hashbrowncms.org/docs/api/)
- [Developer documentation](https://hashbrowncms.org/docs/src/)

## Installing HashBrown
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

## Running HashBrown
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

## Contribute
If you'd like to contribute to HashBrown development, you can make a pull request to [our repo](https://github.com/HashBrownCMS/hashbrown-cms) or contact us about becoming a collaborator

## Report issues
If you have questions, bug reports or anything else of the sort, please use the [issue tracker](https://github.com/HashBrownCMS/hashbrown-cms/issues)
