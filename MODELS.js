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

const postAndReturnComment = (comment, article_id) => {
  const { body, username } = comment;
  // console.log(2);
  return db
    .query(
      `
     INSERT INTO comments
     (body, author, article_id)
     VALUES(
      $1,$2,$3
     )
     RETURNING *;
    `,
      [body, username, article_id]
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 400,
          msg: "No comment provided, try again",
        });
      }
      return rows[0];
    });
};

const fetchUsers = () => {
  return db
    .query(
      `
     SELECT username, name, avatar_url 
     FROM users
     
    `
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 400,
          msg: "No users available, try again",
        });
      }
      // console.log(rows);
      return rows;
    });
};

module.exports = {
  fetchTopics,
  fetchSortedArticles,
  fetchArticleById,
  fetchCommentsByArticle,
  postAndReturnComment,
  fetchUsers,
};
