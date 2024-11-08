/**
 * V2 version of the user api
 * uses mongoose
 */
import express from 'express';
import User from '../../../models/User.js';
import error from '../../../utils/error.js';
const router = express.Router();
const err404 = error(404, 'User does not exist');

router
  .route('/')
  .get(async (req, res, next) => {
    let page = Number(req.query.page);
    let size = Number(req.query.size);
    page = isNaN(page) ? 0 : page;
    size = isNaN(size) ? 10 : size;
    try {
      const users = await User.find()
        .skip(page * size)
        .limit(size);

      res.json(users);
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const user = await new User(req.body).save();
      if (user) {
        res.json(user);
      }
    } catch (err) {
      next(error(400, err.message));
    }
  });

router
  .route('/:id')
  .get(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      if (user) {
        res.json(user);
      } else {
        next(err404);
      }
    } catch (err) {
      next(err);
    }
  })
  .patch(async (req, res, next) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.id },
        req.body
      );
      if (user) {
        res.json(user);
      } else {
        next(err404);
      }
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const result = await User.deleteOne({ _id: req.params.id });
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

export default router;
