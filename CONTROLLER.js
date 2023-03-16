const articles = require("./db/data/test-data/articles");
const {
  fetchTopics,
  fetchSortedArticles,
  fetchArticleById,
  fetchCommentsByArticle,
  postAndReturnComment,
  fetchUsers,
  incrementVotesByArticle,
  fetchArticlesByQuery,
} = require("./MODELS");

const getTopics = (request, response, next) => {
  fetchTopics()
    .then((result) => {
      response.status(200).send(result);
    })
    .catch((err) => {
      // console.log(err in getTopics);
      next(err);
    });
};

const getArticles = (request, response, next) => {
  const { topic, sortBy } = request.query;
  // console.log(topic, sortBy, "in controller");
  fetchSortedArticles(request)
    .then((finalResult) => {
      response.status(200).send({ articles: finalResult });
    })
    .catch((err) => {
      // console.log(err, "error in getArticles");
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
      // console.log(error in getArticleById);
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
      // console.log("error in getCommentsByArticle controller", err);
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
      // console.log("error in postCommentBYArticle controller", err);
      next(err);
    });
};

const patchVotesByArticle = (request, response, next) => {
  const { articleId } = request.params;
  const votesObj = request.body;

  incrementVotesByArticle(votesObj, articleId)
    .then((article) => {
      response.status(200).send({ updatedArticle: article });
    })
    .catch((err) => {
      // console.log(error in patchVotesByArticle);
      next(err);
    });
};

const getUsers = (request, response, next) => {
  fetchUsers()
    .then((users) => {
      response.status(200).send({ allUsers: users });
    })
    .catch((err) => {
      // console.log("error in getUsers controller", err);
      next(err);
    });
};

const getArticlesByQuery = (request, response, next) => {
  const { params } = request.body;
  console.log("params", params);
  console.log("body", request.body);

  fetchArticlesByQuery(params)
    .then((users) => {
      response.status(200).send({ allUsers: users });
    })
    .catch((err) => {
      // console.log("error in getUsers controller", err);
      next(err);
    });
};

module.exports = {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticle,
  postCommentByArticle,
  getUsers,
  patchVotesByArticle,
  getArticlesByQuery,
};
