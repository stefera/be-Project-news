module.exports = handlePsql = (err, request, response, next) => {
  // console.log("psql error in handler", err);
  if (err.code === "23502") {
    response.status(400).send({ msg: "Invalid comment provided, try again" });
  } else if (err.code === "23593" || err.code === "23503") {
    response.status(404).send({ msg: "Not found, try again" });
  } else if (err.code === "42883" || err.code === "42703") {
    response.status(400).send({ msg: "Invalid request, try again" });

    //42883
  } else {
    next(err);
  }
};
//p20202
module.exports = handleCustomErrors = (err, request, response, next) => {
  // console.log("error in customhandler", err);

  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else if (err.code) {
    response.status(400).send({ msg: "Invalid request, try again" });
  } else {
    next(err);
  }
};

module.exports = handle404 = (err, request, response, next) => {
  // console.log("404 error in handler", err);
  if ((err.status = 404) && !err.msg) {
    response.status(err.status).send({ msg: "Item not found, try again" });
  } else if ((err.status = 404) && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};
module.exports = handle500 = (err, request, response, next) => {
  // console.log("500 error in handler", !err.msg);

  if (!err.status || !err.msg) {
    response.status(500).send({ msg: "Internal server error, try again" });
  }
};

module.exports = badPathHandler = (request, response) => {
  // console.log("badpath error in handler", err);
  {
    response.status(404).send({ msg: "Invalid path name, try again" });
  }
};
