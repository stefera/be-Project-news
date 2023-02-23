const articles = require("./db/data/test-data/articles");
const {
  fetchTopics,
  fetchSortedArticles,
  fetchArticleById,
  fetchCommentsByArticle,
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

module.exports = {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticle,
};
