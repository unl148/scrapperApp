// Routes
//var moment = require("moment");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("../models");

module.exports = function(app) {
// A GET route for scraping the echoJS website
// app.get("/scrape", function(req, res) {
//     // First, we grab the body of the html with axios
//     axios.get("http://www.echojs.com/").then(function(response) {
//       // Then, we load that into cheerio and save it to $ for a shorthand selector
//       var $ = cheerio.load(response.data);
//       // Now, we grab every h2 within an article tag, and do the following:
//       $("article h2").each(function(i, element) {
//         // Save an empty result object
//         var result = {};
//         // Add the text and href of every link, and save them as properties of the result object
//         result.title = $(this)
//           .children("a")
//           .text();
//         result.link = $(this)
//           .children("a")
//           .attr("href");
//         // Create a new Article using the `result` object built from scraping
//         db.Article.create(result)
//           .then(function(dbArticle) {
//             // View the added result in the console
//             console.log(dbArticle);
//           })
//           .catch(function(err) {
//             // If an error occurred, log it
//             console.log(err);
//           });
//       });
//       // Send a message to the client
//       res.send("Scrape Complete");
//     });
//   });
  // Route for getting all Articles from the db
  app.get("/api/articles", function(req, res) {


    axios.get("http://www.echojs.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      // Now, we grab every h2 within an article tag, and do the following:
      $("article h2").each(function(i, element) {
        // Save an empty result object
        var result = {};
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
      // Send a message to the client
      res.send("Scrape Complete");
    });

    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({})
    .then(function(dbArticle) {
      // If all Notes are successfully found, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
  });
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/api/articles/:id", function(req, res) {
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
    db.Article.findById(req.params.id)
      // Specify that we want to populate the retrieved libraries with any associated books
      .populate("note")
      .then(function(dbArticle) {
        // If any Libraries are found, send them to the client with any associated Books
        res.json(dbArticle);  
      })
      .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
  });
  // Route for saving/updating an Article's associated Note
  app.post("/api/articles/:id", function(req, res) {
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({_id: req.params.id}, { $push: { note: dbNote._id } }, { new: true });
      })
      .then(function(dbArticle) {
        // If the User was updated successfully, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
  });

  app.post("/api/saveArticle/:id", function(req,res)
  {
    db.Article.findOneAndUpdate({_id: req.params.id}, {saved: "true" } )
      .then(function(){
        // If the User was updated successfully, send it back to the client
        console.log("article Saved");
        res.json(db.Article.findById({_id:req.params.id}))
      })
      .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
  });

  app.post("/api/deleteArticle/:id", function(req,res)
  {
    db.Article.findByIdAndRemove({_id: req.params.id})
      .then(function(){
        // If the User was updated successfully, send it back to the client
        console.log("article Deleted");
        res.json({deleted:true});
      })
      
      .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
  });
}