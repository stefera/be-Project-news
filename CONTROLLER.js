const articles = require("./db/data/test-data/articles");
const {
  fetchTopics,
  fetchCommentCount,
  fetchSortedArticles,
  fetchArticleById,
} = require("./MODELS");

const getTopics = (request, response, next) => {
  fetchTopics()
    .then((result) => {
      response.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (request, response, next) => {
  fetchSortedArticles()
    // .then((articlesWithCommCount) => {
    //   // console.log("articlesWithCount", articlesWithCommCount);

    // })
    .then((finalResult) => {
      // console.log("finalResult", finalResult);
      response.status(200).send({ articles: finalResult });
    })
    .catch((err) => {
      // console.log(err);
      next(err);
    });
};

const getArticleById = (request, response, next) => {
  console.log(request.params);
  const { articleId } = request.params;
  // console.log("articleIDdestructured", articleId);
  fetchArticleById(articleId)
    .then((selectedArticle) => {
      // console.log("arrived in response", { article: selectedArticle });
      response.status(200).send({ article: selectedArticle });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

module.exports = { getTopics, getArticles, getArticleById };
