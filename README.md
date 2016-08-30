# foxx-framework

## Prerequisite

- ArangoDB 3.0.5
- Nginx
- Node.js and npm
- Ruby (for deployment purpose)

## Installation

`$ npm install foxx-framework`

# Creating a new application

`$ foxxy new demo_app`

This will create a new folder named 'demo_app' which will contain everything you need to start your new app.

## Configurating application

````
$ cd demo_app/
$ npm install
````

Now you have all the npm modules installed ... It's time to configure your Nginx app.

````
server {
    listen       8080;
    server_name  demoapp.dev;

    location / {
        root   /path/to/your/folder/public/;
        index  index.html index.htm;
    }

    location /_db {
            allow all;
            proxy_pass http://127.0.0.1:8529/_db;
    }
}
````

Please note that my local Nginx is running on port 8080. Adapt your configuration if needed.
The `public` folder will be created using the `brunch w` command.

Edit your `/etc/hosts` file to point your .dev domain name to your 127.0.0.1 loopback address.

# Creating your first CRUD

`$ foxxy g crud post` 

Please use singular for your model name.

Ok now you have your first CRUD created. 
