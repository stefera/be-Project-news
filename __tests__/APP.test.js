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
      .get("/api/articles/99870987/comments")
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe("No comments found, try again");
      });
  });

  test("returns an appropriate error message (400- Invalid request) when path name contains a spelling error", () => {
    return request(app)
      .get("/api/articles/9w9/comments")
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe("Invalid request, try again");
      });
  });
});

describe("task8- PATCH api/articles/:articleiD/comments", () => {
  test("returns an object article (with correct properties) when articleid given exists", () => {
    const votesObj = { inc_votes: 3 };
    return request(app)
      .patch("/api/articles/3")
      .send(votesObj)
      .expect(200)
      .then(({ body }) => {
        const article = body.updatedArticle;
        expect(article).toMatchObject({
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          article_img_url: expect.any(String),
          votes: expect.any(Number),
        });

        expect(typeof article).toBe("object");
        expect(Array.isArray(article)).toBe(false);
      });
  });

  test("returns an object article with the correct nnumber of votes when object passed has a positive vote number", () => {
    const votesObj = { inc_votes: 3 };
    return request(app)
      .patch("/api/articles/3")
      .send(votesObj)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle.votes).toBe(3);
      });
  });

  test("returns an object article with the correct number of votes when object passed has a negative vote number (less than or equal to existing vote number)", () => {
    const votesObj1 = { inc_votes: 10 };
    const votesObj2 = { inc_votes: -4 };

    request(app)
      .patch("/api/articles/2")
      .send(votesObj1)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle.votes).toBe(10);
      });

    return request(app)
      .patch("/api/articles/2")
      .send(votesObj2)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle.votes).toBe(6);
      });
  });

  test("returns a 400 error (invalid request) when when object passed has a negative vote number greater than the existing vote number)", () => {
    const votesObj = { inc_votes: -10 };
    return request(app)
      .patch("/api/articles/3")
      .send(votesObj)
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe(
          "Invalid request, not enough votes. Please try again"
        );
      });
  });

  test("returns a 400 error (invalid request) when object passed has a vote property of incorrect type", () => {
    const votesObj = { inc_votes: true };
    return request(app)
      .patch("/api/articles/3")
      .send(votesObj)
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe("Invalid request, try again");
      });
  });

  test("returns a 400 error (invalid request) when object passed is empty", () => {
    const votesObj = {};
    return request(app)
      .patch("/api/articles/3")
      .send(votesObj)
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe("Invalid request, try again");
      });
  });

  test("returns a 404 error (Not found) when article does not exist", () => {
    const votesObj = { inc_votes: "3" };
    return request(app)
      .patch("/api/articles/192833")
      .send(votesObj)
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe("Item not found, try again");
      });
  });
});

describe.only("task9- GET api/users", () => {
  test("returns a new array", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.allUsers;
        expect(users).not.toBe(userData);
        expect(userData).not.toBe(users);
        expect(Array.isArray(users)).toBe(true);
      });
  });
  test("returns a correct array of all users objects, each item with the  only the three correct requested properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.allUsers;
        users.forEach((user) => {
          expect(typeof user).toBe("object");
          expect(Array.isArray(user)).toBe(false);

          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
        expect(users.length).toBe(4);
      });
  });

  test("responds with an appropriate error message when users endpoint is misspelt", () => {
    return request(app)
      .get("/api/notusers")
      .expect(404)
      .then((result) => {
        expect(result.status).toBe(404);
        expect(result.body.msg).toBe("Invalid path name, try again");
      });
  });
});
