# foxx-framework

foxx-framework is a simple tool which help you starting with your single page application using ArangoDB / Foxx for backend and API, riotjs for views and brunch to build your assets.

## Prerequisite

- ArangoDB 3.0.5
- Nginx
- Node.js and npm
- Ruby (for deployment purpose)

## Installation

`$ npm install foxx-framework -g` 

## Configurating application

````
$ foxxy new demo_app --database demoapp
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

### Symlink to your foxx folder

To simplify your work, create a symlink from your 

# Creating a new application

First create a database called `demoapp` within ArangoDB Web UI

`$ foxxy new demo_app --database demoapp`

This will create a new folder named 'demo_app' which will contain everything you need to start your new app.

## Install depedencies

`$ cd demo_app`

`$ npm install`

# Creating your first CRUD

`$ foxxy g crud post` 

Please use singular for your model name.

Ok now you have your first CRUD created. 

# Compile the app

## Dev mode

`$ brunch w` will start the live reloader

# Deployment

To deploy your app, you'll need `ruby` and `mina gem`

Check `config/deploy.rb` and adapt it to your needs.

Then run : `$ mina deploy` 

It will compile assets for production env and deploy code (app & Foxx services)
