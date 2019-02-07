
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/solisoft/foxxy)


# foxxy

foxxy is a simple tool which help you starting with your single page application using ArangoDB / Foxx for backend and API, riotjs for views and brunch to build your assets.

https://foxxy.ovh

## Prerequisite

- ArangoDB >= 3.1
- Node.js
- Ruby (for deployment purpose)
- yarn https://yarnpkg.com/en/docs/install

## Installation

`$ npm install foxxy -g`

## Configurating application

````
$ foxxy new demo_app --database demoapp
$ cd demo_app/
$ yarn install
````

You'll also need to have a `~/.foxxrc` file with this content :

```
[server.foxxy]
url=http://localhost:8529
username=root
password=
```

Of course update params if needed.

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

## Upgrading the service

To update your arangodb Foxx service run :

`$ foxxy upgrade` or `$foxxy upgrade <your_service>`

With no arguments, all the service aill be refreshed.

# Compile the app

## Dev mode

`$ yarn start` will start the live reloader and a server.

# Deployment

To deploy your app, you'll need `ruby` and `mina gem`

Check `config/deploy.rb` and adapt it to your needs.

Then run : `$ mina deploy`

It will compile assets for production env and deploy code (app & Foxx services)

