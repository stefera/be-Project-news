const express = require("express");
const { getTopics } = require("./CONTROLLER");
const badPathHandler = require("./CONTROLLER errors");
// const { handle500, handleCustomErrors } = require("./CONTROLLER errors");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.all("*", badPathHandler);

// app.use(handle500);
// app.use(handleCustomErrors);

module.exports = { app };
