var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function (app) {
    app.get("/", function (req, res) {
        console.log("Calling Home page...");
        res.render("search");
    });

    app.get("/articles", function (req, res) {

        axios.get("http://www.echojs.com/").then(function (response) {
            db.Article.remove({});
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);
            // Now, we grab every h2 within an article tag, and do the following:
            $("article h2").each(function (i, element) {
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
                    .then(function (dbArticle) {
                        // View the added result in the console
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log(err);
                    });
            });
            // Send a message to the client
            //res.send("Scrape Complete");
        });

        console.log("html route articles called");
        db.Article.find({})
            .then(function (dbArticles) {
                console.log(dbArticles);
                res.render("articles", { dbArticles: dbArticles, layout: false });
            })
            .catch(function (err) {
                res.json(err);
            });
    });


    app.get("/savedArticles", function (req, res) {
        console.log("html route articles called");
        db.Article.find({ saved: "true" })
            .then(function (dbArticles) {
                console.log(dbArticles);
                res.render("save", { dbArticles: dbArticles, layout: false });
            })
            .catch(function (err) {
                res.json(err);
            });
    });
    app.get("/home", function (req, res) {
        console.log("html route home called");
        db.Article.find({})
            .then(function (dbArticles) {
                console.log(dbArticles);
                res.render("articles", { dbArticles: dbArticles, layout: false });
            })
            .catch(function (err) {
                res.json(err);
            });
    });


};