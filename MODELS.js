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
module.exports = { fetchTopics };
