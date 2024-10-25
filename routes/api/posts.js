const express = require('express');
const error = require('../../utils/error');
const posts = require('../../data/posts');
const comments = require('../../data/comments');
const router = express.Router();
const err404 = error(404, 'Post does not exist');

router
  .route('/')
  .get((req, res) => {
    let filteredPosts = posts;
    if (req.query.userId) {
      filteredPosts = posts.filter((p) => p.userId == req.query.userId);
    }
    res.json(filteredPosts);
  })
  .post((req, res, next) => {
    const body = req.body;

    if (body.userId && body.title && body.content) {
      const post = {
        id: posts[posts.length - 1].id + 1,
        userId: body.userId,
        title: body.title,
        content: body.content,
      };

      posts.push(post);
      res.json(post);
    } else {
      next(error(400, 'Insufficient data'));
    }
  });

router
  .route('/:id')
  .get((req, res, next) => {
    const post = posts.find((p) => p.id == req.params.id);
    if (post) {
      res.json(post);
    } else {
      next(err404);
    }
  })
  .patch((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        for (const key in req.body) {
          posts[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (post) {
      res.json(post);
    } else {
      next(err404);
    }
  })
  .delete((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        posts.splice(i, 1);
        return true;
      }
    });

    if (post) {
      res.json(post);
    } else {
      next(err404);
    }
  });

router.get('/:id/comments', (req, res, next) => {
  let filteredComments = comments.filter((c) => c.postId == req.params.id);
  if (req.query.userId) {
    filteredComments = filteredComments.filter(
      (c) => c.userId == req.query.userId
    );
  }
  res.json(filteredComments);
});

module.exports = router;
