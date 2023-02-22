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

describe("task4- GET api/articles", () => {
  test("returns a new array", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        // console.log(body);
        const originalData = articleData;
        expect(body.articles).not.toBe(originalData);
        expect(Array.isArray(body.articles)).toBe(true);
      });
  });
  test("returns a correct array of all article objects, each with 8 correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        console.log("test1 result and body", body.articles);
        const originalData = articleData;

        body.articles.forEach((item) => {
          expect(item).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
          expect(body.articles.length).toBe(12);
        });
        // expect(body).toEqual(originalData);
      });
  });

  test("responds with an array that is appropriately sorted by created date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("responds with objects that have the correct comment count as a property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          let actualCount = 0;
          actualCount = commentData.filter((comment) => {
            return comment.article_id === article.article_id;
          }).length;

          // console.log("ACTUAL COUNT", actualCount);

          expect(article).toMatchObject({
            comment_count: expect.any(Number),
          });

          // console.log(article.comment_count);
          expect(article.comment_count).toEqual(actualCount);
        });
      });
  });

  test("responds with an appropriate error message when articles endpoint is misspelt", () => {
    return request(app)
      .get("/api/notarticles")
      .expect(404)
      .then((result) => {
        // console.log("error result body", result.body);
        expect(result.status).toBe(404);
        expect(result.body.msg).toBe("Invalid path name, try again");
      });
  });
});
