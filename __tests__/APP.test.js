const request = require("supertest");
const seed = require("../db/seeds/seed");
const {
  topicData,
  commentData,
  articleData,
  userData,
} = require("../db/data/test-data/index");
const data = require("../db/data/test-data/index");
const { app, patch, response } = require("../APP");
const connection = require("../db/connection");
const { string } = require("pg-format");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return connection.end();
});

describe("task3- GET api/topics", () => {
  test("returns a new array", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        // console.log(body);
        const originalData = topicData;
        expect(body).not.toBe(originalData);
        expect(originalData).not.toBe(body);
        expect(Array.isArray(body)).toBe(true);
      });
  });
  test("returns a correct array of all topics, each with a correct slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const originalData = topicData;

        body.forEach((item) => {
          expect(item).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
          expect(body.length).toBe(3);
        });
        expect(body).toEqual(originalData);
      });
  });

  test("responds with an appropriate error message when topics endpoint is misspelt", () => {
    return request(app)
      .get("/api/nottopics")
      .expect(404)
      .then((result) => {
        console.log("error result body", result.body);
        expect(result.status).toBe(404);
        expect(result.body.msg).toBe("Invalid path name, try again");
      });
  });
});
