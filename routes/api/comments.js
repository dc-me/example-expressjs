import express from 'express';
import error from '../../utils/error.js';
import comments from '../../db/comments.js';
const router = express.Router();
const err404 = error(404, 'Comment does not exist');

router
  .route('/')
  .get((req, res, next) => {
    const { userId, postId } = req.query;
    let filteredComments = comments;
    if (userId) {
      filteredComments = filteredComments.filter((c) => c.userId == userId);
    }
    if (postId) {
      filteredComments = filteredComments.filter((c) => c.postId == postId);
    }
    res.json(filteredComments);
  })
  .post((req, res, next) => {
    const body = req.body;
    if (body.userId && body.postId && body.body) {
      const comment = {
        id: comments[comments.length - 1].id + 1,
        userId: body.userId,
        postId: body.postId,
        body: body.body,
      };

      comments.push(comment);
      res.json(comment);
    } else {
      next(error(400, 'Insufficient data'));
    }
  });

router
  .route('/:id')
  .get((req, res, next) => {
    const comment = comments.find((c) => c.id == req.params.id);
    if (comment) {
      res.json(comment);
    } else {
      next(err404);
    }
  })
  .patch((req, res, next) => {
    const comment = comments.find((c, i) => {
      if (c.id == req.params.id) {
        // only support update the comment body
        comments[i].body = req.body.body;
        return true;
      }
    });

    if (comment) {
      res.json(comment);
    } else {
      next(err404);
    }
  })
  .delete((req, res, next) => {
    const comment = comments.find((c, i) => {
      if (c.id == req.params.id) {
        comments.splice(i, 1);
        return true;
      }
    });

    if (comment) {
      res.json(comment);
    } else {
      next(err404);
    }
  });

export default router;
