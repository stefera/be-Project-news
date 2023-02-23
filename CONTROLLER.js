const articles = require("./db/data/test-data/articles");
const {
  fetchTopics,
  fetchSortedArticles,
  fetchArticleById,
  fetchCommentsByArticle,
  postAndReturnComment,
} = require("./MODELS");

const getTopics = (request, response, next) => {
  fetchTopics()
    .then((result) => {
      response.status(200).send(result);
    })
    .catch((err) => {
      // console.log(err);
      next(err);
    });
};

const getArticles = (request, response, next) => {
  fetchSortedArticles()
    .then((finalResult) => {
      response.status(200).send({ articles: finalResult });
    })
    .catch((err) => {
      // console.log(err);
      next(err);
    });
};

const getArticleById = (request, response, next) => {
  const { articleId } = request.params;
  fetchArticleById(articleId)
    .then((selectedArticle) => {
      response.status(200).send({ article: selectedArticle });
    })
    .catch((err) => {
      // console.log(err);
      next(err);
    });
};

const getCommentsByArticle = (request, response, next) => {
  const { articleId } = request.params;
  fetchCommentsByArticle(articleId)
    .then((selectedComments) => {
      response.status(200).send({ comments: selectedComments });
    })
    .catch((err) => {
      // console.log(err);
      next(err);
    });
};

const postCommentByArticle = (request, response, next) => {
  const { articleId } = request.params;
  postAndReturnComment(request.body, articleId)
    .then((comment) => {
      response.status(201).send({ postedComment: comment });
    })
    .catch((err) => {
      console.log("error in controller", err);
      next(err);
    });
};
module.exports = {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticle,
  postCommentByArticle,
};
