const express = require("express");
const ArticlesService = require("./folders-service");
const xss = require("xss");
const articlesRouter = express.Router();
const jsonParser = express.json();

articlesRouter
  .route("/")
  .get((req, res, next) => {
    ArticlesService.getAllArticles(req.app.get("db"))
      .then((articles) => {
        res.json(articles);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { title, content, style } = req.body;
    const newArticle = { title, content, style };
    ArticlesService.insertArticle(req.app.get("db"), newArticle)
      .then((article) => {
        res.status(201).location(`/articles/${article.id}`).json(article);
      })
      .catch(next);
  });

articlesRouter
  .route("/:article_id")
  .all((req, res, next) => {
    ArticlesService.getById(req.app.get("db"), req.params.article_id)
      .then((article) => {
        if (!article) {
          return res.status(404).json({
            error: { message: `Article doesn't exist` },
          });
        }
        res.article = article; // save the article for the next middleware
        next(); // don't forget to call next so the next middleware happens!
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json({
      id: res.article.id,
      style: res.article.style,
      title: xss(res.article.title), // sanitize title
      content: xss(res.article.content), // sanitize content
      date_published: res.article.date_published,
    });
  });

module.exports = articlesRouter;
