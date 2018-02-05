var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/huffscrapedb", {
  useMongoClient: true
});

// Routes

// A GET route for scraping the echojs website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("https://www.huffingtonpost.com/topic/activism").then(function(response) {

    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    
    // Now, we grab every h2 within an article tag, and do the following:
    $("h2").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
      // result.link = $(this)
      //   .children("class",".card_image_src")
      //   .attr("background-image", "url")  

      // Create a new Article using the `result` object built from scraping
      db.Article
        .create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article
  .find({})
  .then(function(articles) {
      // If all Users are successfully found, send them back to the client
      res.json(articles);
    })
    .catch(function(err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    })
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included

  db.Article
  .findOne(
  {
    _id: req.params.id
  })
  .populate('note')
  .then(function(article) {
      // If all Users are successfully found, send them back to the client
      res.json(article);
    })
    .catch(function(err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    })
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Note
  .create(req.body)
  .then(function(note) {
    // If a Note was created successfully, find one Article (there's only one) and push the new Note's _id to the Article's `notes` array
    // { new: true } tells the query that we want it to return the updated Article -- it returns the original by default
    // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
  return db.Article
  .findOneAndUpdate({_id: req.params.id}, { $set: { note: note._id } }, { new: true });
  })
  .then(function(article) {
    // If the Article was updated successfully, send it back to the client
    res.json(article);
  })
  .catch(function(err) {
    // If an error occurs, send it back to the client
    res.json(err);
  });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
