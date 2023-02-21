const { fetchTopics } = require("./MODELS");

// console.log("arrived in controller");
const getTopics = (request, response, next) => {
  //   console.log("arrived in controller  function");

  fetchTopics()
    .then((result) => {
      //   console.log("controller result", result);
      response.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getTopics };
