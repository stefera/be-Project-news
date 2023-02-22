const pg = require("pg-format");
const db = require("./db/connection");

const fetchTopics = () => {
  //   console.log("arrived in models funciton");
  return db
    .query(
      `
       SELECT * FROM topics
       `
    )
    .then((result) => {
      //   console.log("models results rows", result.rows);
      //   console.log("models results", result);

      return result.rows;
    });
};

const fetchSortedArticles = () => {
  // return db.query(
  //   `
  //   SELECT * FROM articles`
  // );
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

const fetchCommentCount = (arrayOfArticles) => {
  arrayOfArticles.forEach((article) => {
    db.query(
      `
      SELECT * FROM comments
      WHERE article_id = ${article.article_id}`
    ).then(({ rows }) => {
      console.log("arrived");
      article.comment_count = rows.length;
    });
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
      // console.log("rows of article", rows[0]);
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: "Item not found, try again",
        });
      }
      return rows[0];
    });
};

module.exports = {
  fetchTopics,
  fetchSortedArticles,
  fetchCommentCount,
  fetchArticleById,
};
