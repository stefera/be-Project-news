module.exports = handle400 = (err, request, response, next) => {
  if (err.code !== "23593") {
    if (err.code === "23502" || err.code === "23503") {
      response.status(400).send({ msg: "Invalid comment provided, try again" });
    }
    // else if (err.code && err.msg) {
    //   console.log("here");
    //   response.status(400).send({ msg: err.msg });
    // }
  }
  if (err.code) {
    console.log("here");
    response.status(400).send({ msg: "Invalid request, try again" });
  } else {
    next(err);
  }
};

module.exports = handle404 = (err, request, response, next) => {
  console.log("404", err);
  if ((err.status = 404) && !err.msg) {
    response.status(err.status).send({ msg: "Item not found, try again" });
  } else if ((err.status = 404) && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};
module.exports = badPathHandler = (request, response) => {
  console.log("here123");
  {
    response.status(404).send({ msg: "Invalid path name, try again" });
  }
};

// module.exports = handleCustomErrors = (err, request, response, next) => {
//   if (err.status && err.msg) {
//     response.status(err.status).send({ message: err.msg });
//   } else {
//     next(err);
//   }
// };

// module.exports = handle500 = (err, request, response, next) => {
//   if (!err.status || !err.msg) {
//     response.status(500).send({ message: "Internal server error" });
//   }
// };
