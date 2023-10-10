const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const articlesSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model('Article',articlesSchema);

// Request targeting all articles

app.route("/articles")

    .get(async function(req,res){
        try{
            const articles = await Article.find();
            res.send(articles);

        }catch(err){
            res.send(err);
        }
    })

    .post(async function(req,res){
        const article = new Article({title: req.body.title,content: req.body.content});

        await article.save().then(function(docs) {
            res.send("Successfully added");
        })
        .catch(function(err) {
            res.send(err);
        });
    })

    .delete(async function(req,res){
        await Article.deleteMany().then(function(docs){
            res.send("Successfully deleted all articles");
        }).catch(function(err){
            res.send(err);
        })
    });


// Request targeting specific article

app.route("/articles/:articleTitle")
    .get(async function(req,res){
        try{
            const articleTitle = req.params.articleTitle;
            const foundArticle = await Article.findOne({title:articleTitle})

            if (foundArticle){
                res.send(foundArticle);
            }else{
                res.send("No articles matching that title was found.");
            }
            
        }catch(err){
            res.send(err);
        }
    }
    )
    .put(async function(req,res){
        try{
        
        await Article.replaceOne(
            {title:req.params.articleTitle},
            {title:req.body.title,content:req.body.content},
            );
        res.send("Successfully updated article");
        }catch(err){
            res.send(err);
        }
    })
    .patch(async function(req,res){
        try{
        
        await Article.updateOne(
            {title:req.params.articleTitle},
            {$set:req.body}
            );
        res.send("Successfully updated article");
        }catch(err){
            res.send(err);
        }
    })
    .delete(async function(req,res){
        await Article.deleteOne({title:req.params.articleTitle}).then(function(docs){
            res.send("Successfully deleted specified article");
        }).catch(function(err){
            res.send(err);
        })
        
    });


app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
  