
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var db = require("../models");
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });
module.exports = function (app) {

    app.get("/", function (req, res) {
        // db.Article.remove({})
        //     .then(function () {
        //         console.log("removed database")
        //     })

        // First, we grab the body of the html with axios
        axios.get("https://www.echojs.com/").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);
            var result = [];
            console.log($.children)
            // Now, we grab every h2 within an article tag, and do the following:
            $("article").each(function (i, element) {
                // Save an empty result object
                console.log($(this).children("h2").text())
                console.log($(this).attr("data-news-id"))

                var data = {
                    title: $(this).children("h2").text(),
                    link: $(this).children("h2").children("a").attr("href"),
                    id: $(this).attr("data-news-id")
                }
                result.push(data)
            });
            res.render("index", {
                story: result
            });


        });
        // Send a message to the client

    });
    // api to grab all the articles 
    app.post("/update", function (req, res) {
        // Grab every document in the Articles collection
        db.Article.find({ id: req.body.id })
            .then(function (data) {
                
                if (data == "") {
                    console.log("data doesnt exist adding to database")
                    db.Article.create(req.body)
                        .then(function (dbArticle) {
                            console.log(dbArticle)
                        })
                        .catch(function (err) {
                            // If an error occurred, send it to the client
                            res.json(err);
                        });

                }
                else {
                    console.log("already exists")
                }

            })
    });

    // api to create the saved articles

    //api to search the database for correct the correct article
    app.get("/article/", function (req, res) {
        db.Article.find({})
            .then(function (dbdata) {
                res.render("saved", {
                    data: dbdata
                })

            }).catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    app.get("/article/:id", function (req, res) {
        db.Article.find({ id: req.params.id })
            .then(function (updateData) {
                res.render("update", {
                    data:updateData
                })
            })
    })

    app.get("/clear", function (req, res) {
        db.Article.remove({})
            .then(function (dbdata) {
                console.log(dbdata)
            })
    })
}