# HashBrown CMS
A free and open-source headless CMS built with Node.js and MongoDB

## The centralised approach
Ever wonder why you have to run a completely separate CMS for every single project? We did too, and that's why HashBrown exists today. This is the new central brain for your extended project structure.

## Installing and running HashBrown
First make sure you have these dependencies met:  
- node.js >= v10 
- mongodb >= v4
- imagemagick  

Then checkout the code and install the dependencies:  
```
git clone https://github.com/HashBrownCMS/hashbrown-cms.git -b stable --single-branch --recursive
cd ./hashbrown-cms
npm install --production
```

Configuring MongoDB:

- by environment variables:

  - `MONGODB_HOST`: host(s), split by comma, default value is `localhost`
  - `MONGODB_PORT`: port(s), split by comma
  - `MONGODB_USERNAME`: username
  - `MONGODB_PASSWORD`: password
  - `MONGODB_PREFIX`: database name prefix, default value is `hb_`
  - `MONGODB_OPTIONS`: connection options, JSON string containing key/value pairs.

- or by `/config/database.cfg`

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

## Talk to us

Matrix: #hashbrowncms:matrix.org

## Report issues
If you have questions, bug reports or anything else of the sort, please use the [issue tracker](https://github.com/Putaitu/hashbrown-cms/issues)
