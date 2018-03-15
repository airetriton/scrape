HEROKU LOGIN

## Step 1
    $ heroku login
        Enter your Heroku credentials.
        Email: zeke@example.com
        Password:

## Step 2
    $ heroku create

## Step 3
    $ git push heroku master

## Step 4
    $ heroku ps:scale web=1
    
## Step 5
    $ heroku open

## Step 6
    $ heroku logs --tail

## Step 7
    Define a Procfile:
        Use a Procfile, a text file in the root directory of your application, to explicitly declare what command should be executed to start your app.

        The Procfile in the example app you deployed looks like this:

        web: node index.js
        This declares a single process type, web, and the command needed to run it. The name web is important here. It declares that this process type will be attached to the HTTP routing stack of Heroku, and receive web traffic when deployed.

## Step 8
    You can check how many dynos are running using the ps command:
    $ heroku ps
    https://devcenter.heroku.com/articles/getting-started-with-nodejs#scale-the-app

## Mongo
    
    Run this command in your Terminal/Bash window:
    * `heroku addons:create mongolab`
    * This command will add the free mLab provision to your project.
    * heroku addons:create mongolab
    * heroku addons:docs mongolab
    * heroku config:get MONGODB_URI
 
 nodemon