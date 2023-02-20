const format = require("pg-format");
const db = require("./db/data/test-data/index");

const fetchTopics = () => {
  return db.query(
    `
        SELECT * FROM topics
        `
  );
};

module.exports = { fetchTopics };
