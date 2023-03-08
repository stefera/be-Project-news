const express = require("express");
const {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticle,
  postCommentByArticle,
  patchVotesByArticle,
  getUsers,
  getArticlesByQuery,
} = require("./CONTROLLER");
const badPathHandler = require("./CONTROLLER errors");
// const { handle500, handleCustomErrors } = require("./CONTROLLER errors");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);

app.get("/api/articles/:articleId", getArticleById);
app.get("/api/articles/:articleId/comments", getCommentsByArticle);
app.post("/api/articles/:articleId/comments", postCommentByArticle);
app.get("/api/users", getUsers);
app.patch("/api/articles/:articleId", patchVotesByArticle);

app.get("/api/articles?query", getArticlesByQuery);

app.use(handlePsql);
app.use(handleCustomErrors);
// app.use(handle400);
// app.use(handle404);
app.use(handleCustomErrors);
app.use(handle500);
app.all("*", badPathHandler);
// app.use(handleCustomErrors);

module.exports = { app };
