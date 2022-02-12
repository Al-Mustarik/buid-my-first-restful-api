import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
   title: String,
   content: String,
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
   .get((req, res) => {
      Article.find({}, (err, foundArticles) => {
         if (!err) {
            res.send(foundArticles);
         } else {
            res.send(err);
         }
      });
   })
   .post((req, res) => {
      const title = req.body.title;
      const content = req.body.content;
      console.log(title);
      console.log(content);
      const newArticle = new Article({
         title: title,
         content: content,
      });
      newArticle.save(function (err) {
         if (!err) {
            res.send("Successfully added a new article.");
         } else {
            res.send(err);
         }
      });
   })
   .delete((req, res) => {
      Article.deleteMany({}, (err) => {
         if (!err) {
            res.send("Successfully deleted all articles.");
         } else {
            res.send(err);
         }
      });
   });
   
/**
 * !Request targeting a specific article.
 */

app.route("/articles/:articleTitle")
   .get((req, res) => {
      Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
         if (!err) {
            res.send(foundArticle);
         } else {
            res.send("No article match found!");
         }
      });
   })
   .put((req, res) => {
      Article.findOneAndUpdate(
         { title: req.params.articleTitle },
         { title: req.body.title, content: req.body.content },
         { overwrite: true },
         (err) => {
            if (!err) {
               res.send("Successfully updated the article.");
            }
         }
      );
   })
   .patch((req, res) => {
      Article.findOneAndUpdate({ title: req.params.articleTitle }, { $set: req.body }, (err) => {
         if (!err) {
            res.send("Successfully updated articles.");
         }
      });
   })
   .delete((req, res) => {
      Article.deleteOne({ title: req.params.articleTitle }, (err) => {
         if (!err) {
            res.send("Successfully deleted the article.");
         }
      });
   });

app.listen(3000, function () {
   console.log("Server started on post 3000");
});
