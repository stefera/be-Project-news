module.exports = handle400 = (err, request, response, next) => {
  if (err.code) {
    response.status(400).send({ message: "Invalid request, try again" });
  } else {
    next(err);
  }
};

module.exports = handle404 = (err, request, response, next) => {
  // console.log("error arrived", err);
  if ((err.status = 404)) {
    response.status(404).send({ msg: "Item not found, try again" });
  } else {
    next(err);
  }
};
module.exports = badPathHandler = (request, response) => {
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
