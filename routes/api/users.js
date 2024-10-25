const express = require('express');
const router = express.Router();

const users = require('../../data/users');
const posts = require('../../data/posts');
const comments = require('../../data/comments');
const error = require('../../utils/error');
const err404 = error(404, 'User does not exist');

router
  .route('/')
  .get((req, res) => {
    res.json(users);
  })
  .post((req, res, next) => {
    const body = req.body;

    if (body.name && body.username && body.email) {
      if (users.find((u) => u.username === body.username)) {
        next(error(409, 'Username already taken'));
      } else {
        const user = {
          id: users[users.length - 1].id + 1,
          name: body.name,
          username: body.username,
          email: body.email,
        };

        users.push(user);
        res.json(user);
      }
    } else {
      next(error(400, 'Insufficient data'));
    }
  });

router
  .route('/:id')
  .get((req, res, next) => {
    const user = users.find((u) => u.id == req.params.id);
    if (user) {
      res.json(user);
    } else {
      next(err404);
    }
  })
  .patch((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        for (const key in req.body) {
          users[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (user) {
      res.json(user);
    } else {
      next(err404);
    }
  })
  .delete((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        users.splice(i, 1);
        return true;
      }
    });

    if (user) {
      res.json(user);
    } else {
      next(err404);
    }
  });

router.get('/:id/posts', (req, res, next) => {
  const userId = Number(req.params.id);
  const uPosts = posts.filter((p) => p.userId === userId);
  res.json(uPosts);
});

router.get('/:id/comments', (req, res, next) => {
  let filteredComments = comments.filter((c) => c.userId == req.params.id);
  if (req.query.postId) {
    filteredComments = filteredComments.filter(
      (c) => c.postId == req.query.postId
    );
  }
  res.json(filteredComments);
});

module.exports = router;
