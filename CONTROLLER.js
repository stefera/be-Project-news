const { fetchTopics } = require("./MODELS");

const getTopics = () => {
  fetchTopics().then((result) => {});
};

module.exports = { getTopics };
