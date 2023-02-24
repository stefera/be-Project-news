const pg = require("pg-format");
const db = require("./db/connection");

const fetchTopics = () => {
  return db
    .query(
      `
       SELECT * FROM topics
       `
    )
    .then((result) => {
      return result.rows;
    });
};

const fetchSortedArticles = () => {
  return db
    .query(
      `
       SELECT articles.author,title,articles.article_id,articles.created_at,articles.votes,article_img_url, cast(COUNT(comment_id) AS INT) AS comment_count
       FROM articles
       LEFT JOIN comments ON comments.article_id = articles.article_id
       GROUP BY articles.article_id       
       ORDER BY created_at DESC
       `
    )
    .then(({ rows }) => {
      return rows;
    });
};

const fetchArticleById = (article_id) => {
  return db
    .query(
      `
       SELECT * FROM articles
       WHERE article_id = ${article_id}
       `
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: "Item not found, try again",
        });
      }
      return rows[0];
    });
};

const fetchCommentsByArticle = (article_id) => {
  return db
    .query(
      `
     SELECT * FROM comments
     WHERE article_id = ${article_id}
     ORDER BY created_at DESC`
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: "No comments found, try again",
        });
      }
      return rows;
    });
};

const incrementVotesByArticle = (votesObj, article_id) => {
  const { inc_votes } = votesObj;

  return db
    .query(
      `
     UPDATE articles
     SET
     votes = votes + ${inc_votes}
     WHERE article_id = ${article_id}
     RETURNING *;
    `
    )
    .then(({ rows }) => {
      if (rows[0].votes < 0) {
        return Promise.reject({
          status: 400,
          msg: "Invalid request, not enough votes. Please try again",
        });
      }
      return rows[0];
    });
};
module.exports = {
  fetchTopics,
  fetchSortedArticles,
  fetchArticleById,
  fetchCommentsByArticle,
  incrementVotesByArticle,
};
