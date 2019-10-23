var db = require("../models");

module.exports = function(app) {
    app.get("/", function(req, res) {
        console.log("Calling Home page...");
      res.render("search");
    });
    app.get("/articles", function(req, res) {
        console.log("html route articles called");
        db.Article.find({})
        .then(function(dbArticles) {    
            console.log(dbArticles);        
            res.render("articles", {dbArticles:dbArticles, layout:false});
        })
        .catch(function(err) {      
            res.json(err);
        });
    });
};