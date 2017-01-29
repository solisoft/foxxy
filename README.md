
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/solisoft/foxxy)


# foxx-framework

foxx-framework is a simple tool which help you starting with your single page application using ArangoDB / Foxx for backend and API, riotjs for views and brunch to build your assets.

https://www.foxx-framework.com

## Prerequisite

- ArangoDB >= 3.x
- Node.js
- Ruby (for deployment purpose)
- yarn https://yarnpkg.com/en/docs/install

## Installation

`$ npm install foxx-framework -g`

## Configurating application

````
$ foxxy new demo_app --database demoapp
$ cd demo_app/
$ yarn install
````

### Symlink to your foxx folder

To simplify your work, create a symlink from your arangodb foxx folder to your app foxx folder

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

`$ yarn run brunch w -- --server` will start the live reloader and a server.

# Deployment

To deploy your app, you'll need `ruby` and `mina gem`

Check `config/deploy.rb` and adapt it to your needs.

Then run : `$ mina deploy`

It will compile assets for production env and deploy code (app & Foxx services)

# Todo

- Use jwtTokens to avoid nginx _db mounting point