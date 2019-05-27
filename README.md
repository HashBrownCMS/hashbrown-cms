# HashBrown CMS
A free and open-source headless CMS built with Node.js and MongoDB

## NOTICE: Updating from v1.1 to v1.2
The `/db` folder for the `mongodb` docker volume has been moved, along with all other docker related files, to the `/docker` folder. After you pull the latest changes, make sure to manually move your `/db` folder to `/docker/db` before you restart the container.

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
git clone https://github.com/HashBrownCMS/hashbrown-cms.git -b stable --single-branch --recursive
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

## Getting started
- [Guides](http://hashbrown.rocks/guides)
- [Documentation](http://hashbrown.rocks/docs)

## Contribute
If you'd like to contribute to HashBrown development, you can make a pull request to [our repo](https://github.com/HashBrownCMS/hashbrown-cms) or contact us about becoming a collaborator

## Talk to us
Matrix: #hashbrowncms:matrix.org

## Report issues
If you have questions, bug reports or anything else of the sort, please use the [issue tracker](https://github.com/Putaitu/hashbrown-cms/issues)
