# HashBrown CMS
A free and open-source headless CMS built with Node.js and MongoDB

## The centralised approach
Ever wonder why you have to run a completely separate CMS for every single project? We did too, and that's why HashBrown exists today. This is the new central brain for your extended project structure.

## Installing and running HashBrown
First make sure you have these dependencies met:  
- node.js >= v6 
- mongodb >= v3.2  

Then checkout the code and install the dependencies:  
```
git clone https://github.com/HashBrownCMS/hashbrown-cms.git -b stable --single-branch --recursive
cd ./hashbrown-cms
npm install --production
```

Running with docker:
```
docker-compose up --build -d
```

Running standalone:
```
node hashbrown.js
```

## Updating HashBrown
To update the core HashBrown version and all of its dependencies:
```
cd /to/your/hashbrown/dir
git pull
git submodule update --recursive --init
npm install --production
```

## Getting started
- [Guides](http://hashbrown.rocks/guides)
- [Documentation](http://hashbrown.rocks/docs)

## Contribute
If you'd like to contribute to HashBrown development, you can make a pull request to [our repo](https://github.com/HashBrownCMS/hashbrown-cms) or contact us about becoming a collaborator

## Ask a question
Here: [/r/HashBrownCMS/](https://www.reddit.com/r/HashBrownCMS/)

## Report issues
If you have questions, bug reports or anything else of the sort, please use the [issue tracker](https://github.com/Putaitu/hashbrown-cms/issues)
