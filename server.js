// Dependencies
// =============================================================
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const request = require('request');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
// =============================================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// Set Handlebars as the default templating engine.
// =============================================================
let hbs = exphbs.create({
    defaultLayout: 'main',
})
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Static directory
// =============================================================
app.use(express.static('public'));

// Routes
// =============================================================
let htmlRoute = require('./routes/html-route.js');

app.use('/', htmlRoute);

// Requiring our models for syncing
// =============================================================
const article = require('./models/Articles');
const comment = require('./models/Comments');
let newsdb = 'mongodb://localhost/newsdb';
// let scraper = require('./db/articleScaper');

mongoose.connect('mongodb://heroku_j98vqdl6:a025krggacj74la906pnadk7oo@ds157873.mlab.com:57873/heroku_j98vqdl6');

// newsdb, {
//     useMongoClient:true
// }

// Starting our Express app
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
