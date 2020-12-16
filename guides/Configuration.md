How to configure HashBrown for your needs

## System
### Using `/config/system.cfg`
```
{
  "rootUrl": "<used when hosting in a subdirectory, like /cms>"
  "isSingleProject": true|false,
  "isSingleEnvironment": true|false
}
```

## Database  
### Using environment variables:
  - `MONGODB_HOST`: host(s), split by comma, default value is `localhost`
  - `MONGODB_PORT`: port(s), split by comma
  - `MONGODB_USERNAME`: username
  - `MONGODB_PASSWORD`: password
  - `MONGODB_PREFIX`: database name prefix, default value is `hb_`
  - `MONGODB_OPTIONS`: connection options, JSON string containing key/value pairs.

### Using `/config/database.cfg`
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

