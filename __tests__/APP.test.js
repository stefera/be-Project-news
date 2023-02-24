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
        const originalData = articleData;

        body.articles.forEach((item) => {
          expect(item).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            votes: expect.any(Number),
          });
          expect(body.articles.length).toBe(12);
        });
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
          expect(article).toMatchObject({
            comment_count: expect.any(Number),
          });

          expect(article.comment_count).toEqual(actualCount);
        });
      });
  });

  test("responds with an appropriate error message when articles endpoint is misspelt", () => {
    return request(app)
      .get("/api/notarticles")
      .expect(404)
      .then((result) => {
        expect(result.status).toBe(404);
        expect(result.body.msg).toBe("Invalid path name, try again");
      });
  });
});

describe("task5- GET api/articles/:articleiD", () => {
  test("returns a single object (with correct properties article) when id exists", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toMatchObject({
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          article_img_url: expect.any(String),
        });

        expect(typeof article).toBe("object");
        expect(Array.isArray(article)).toBe(false);
        expect(article.article_id).toBe(3);
      });
  });

  test("returns the correct article object when id exists", () => {
    return request(app)
      .get("/api/articles/6")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;

        expect(article.article_id).toBe(6);
      });
  });
  test("responds with approperitate error (404 Not found) when no article with given ID exists", () => {
    return request(app)
      .get("/api/articles/698")
      .expect(404)
      .then((result) => {
        expect(result.status).toBe(404);
        expect(result.body.msg).toBe("Item not found, try again");
      });
  });

  test("responds with approperitate error (400- bad request) when given an invalid articleID type", () => {
    return request(app)
      .get("/api/articles/69w8")
      .expect(400)
      .then((result) => {
        expect(result.status).toBe(400);
        expect(result.body.msg).toBe("Invalid request, try again");
      });
  });
});

describe("task6- GET api/articles/:articleiD/comments", () => {
  test("returns an array of comments (with correct properties article) when articleid given exists", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
          });
          expect(Array.isArray(comments)).toBe(true);
          expect(comments.length).toBe(2);
        });
      });
  });

  test("returns the correct array of comments with the correct article id when articleid given exists", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        comments.forEach((comment) => {
          expect(comment.article_id).toBe(1);
        });
      });
  });

  test("returns the correct array of comments in descending creation date order when articleid given exists", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        comments.forEach((comment) => {
          expect(comment.article_id).toBe(5);
        });
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });

  test("returns an appropriate error message (404- No comments found) when no comments are found", () => {
    return request(app)
      .get("/api/articles/99/comments")
      .expect(404)
      .then((result) => {
        expect(result.status).toBe(404);
        expect(result.body.msg).toBe("No comments found, try again");
      });
  });

  test("returns an appropriate error message (400- Invalid request) when path name contains a spelling error", () => {
    return request(app)
      .get("/api/articles/9w9/comments")
      .expect(400)
      .then((result) => {
        expect(result.status).toBe(400);
        expect(result.body.msg).toBe("Invalid request, try again");
      });
  });
});

describe("task7- POST /api/articles/:article_id/comments", () => {
  test("posts and returns an object with the correct properties when given valid article_id", () => {
    const newCommentData = { body: "hi there", username: "icellusedkars" };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newCommentData)
      .expect(201)
      .then(({ body }) => {
        const postedComment = body.postedComment;

        expect(postedComment).toMatchObject({
          comment_id: expect.any(Number),
          body: expect.any(String),
          votes: expect.any(Number),
          author: expect.any(String),
          created_at: expect.any(String),
        });
        expect(postedComment.article_id).toBe(3);
        expect(typeof postedComment).toBe("object");
        expect(Array.isArray(postedComment)).toBe(false);
      });
  });

  test("returns a 400 error if no comment is passed to the body of the request comment given to post has incorrect properties", () => {
    // const newCommentData = {};
    return request(app)
      .post("/api/articles/3/comments")
      .send()
      .expect(400)
      .then((result) => {
        expect(result.status).toBe(400);
        expect(result.body.msg).toBe("Invalid comment provided, try again");
      });
  });

  test("returns a 400 error if an invalid article ID is given", () => {
    // const newCommentData = {};
    return request(app)
      .post("/api/articles/31312w/comments")
      .send()
      .expect(400)
      .then((result) => {
        expect(result.status).toBe(400);
        expect(result.body.msg).toBe("Invalid request, try again");
      });
  });

  test("returns a 404 error if article given is not found", () => {
    const newCommentData = { body: "asdfgh", username: "icellusedkars" };
    return request(app)
      .post("/api/articles/299999/comments")
      .send(newCommentData)
      .expect(404)
      .then((result) => {
        expect(result.status).toBe(404);
        expect(result.body.msg).toBe("Not found, try again");
      });
  });

  test("returns a 404 error if the username given in the correct format, but not found", () => {
    const newCommentData = { body: "asdfgh", username: "true" };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newCommentData)
      .expect(404)
      .then((result) => {
        expect(result.status).toBe(404);
        expect(result.body.msg).toBe("Not found, try again");
      });
  });
});
