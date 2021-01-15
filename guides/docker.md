# Docker

An extensive example running multiple websites and environments sugin docker-compose

```yaml
version: "3.4"

networks:
    example--network: ~
    
services:
    cms:
        image: hashbrowncms/hashbrowncms
        container_name: "example--cms"
        ports:
            - 8080:8080
        depends_on:
            - mongodb
        networks:
            - example--network
        restart: unless-stopped
        environment:
            - MONGODB_HOST=mongodb
        volumes:
            - "./storage:/srv/app/storage" # For content and media
            - "./plugins:/srv/app/plugins" # For custom code

    mongodb:
        image: mongo
        container_name: "example--mongodb"
        networks:
            - example--network
        restart: unless-stopped
        volumes:
            - "./db:/data/db"

    # A live environment for website #1
    website-1-live:
        image: node
        container_name: "example--website-1-live"
        command: node /srv/app/src/index.js
        ports:
            - 1001:80
        volumes:
            - "./website_1/live:/srv/app/src" # The website server code
            - "./storage/website_1/live/content:/srv/app/content" # Content files to be presented by the website
            - "./storage/website_1/live/media:/srv/app/public/media" # Public directory for media files
    
    # A staging environment for website #1
    website-1-staging:
        image: node
        container_name: "example--website-1-staging"
        command: node /srv/app/src/index.js
        ports:
            - 2001:80
        volumes:
            - "./website_1/staging:/srv/app/src"
            - "./storage/website_1/staging/content:/srv/app/content"
            - "./storage/website_1/staging/media:/srv/app/public/media"
    
    # A live environment for website #2
    website-1-live:
        image: node
        container_name: "example--website-1-live"
        command: node /srv/app/src/index.js
        ports:
            - 1002:80
        volumes:
            - "./website_2/live:/srv/app/src"
            - "./storage/website_2/live/content:/srv/app/content"
            - "./storage/website_2/live/media:/srv/app/public/media"
    
    # A staging environment for website #2
    website-2-staging:
        image: node
        container_name: "example--website-2-staging"
        command: node /srv/app/src/index.js
        ports:
            - 2002:80
        volumes:
            - "./website_2/staging:/srv/app/src"
            - "./storage/website_2/staging/content:/srv/app/content"
            - "./storage/website_2/staging/media:/srv/app/public/media"
```
