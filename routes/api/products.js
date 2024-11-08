import express from 'express';
import Product from '../../models/Product.js';
import error from '../../utils/error.js';
const router = express.Router();

router
  .route('/')
  .get(async (req, res, next) => {
    let page = Number(req.query.page);
    let size = Number(req.query.size);
    page = isNaN(page) ? 0 : page;
    size = isNaN(size) ? 10 : size;

    try {
      const products = await Product.find()
        .skip(page * size)
        .limit(size);

      res.json(products);
    } catch (error) {
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const product = await new Product(req.body).save();
      res.json(product);
    } catch (error) {
      next(error);
    }
  });

router
  .route('/:id')
  .get(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (product) {
        res.json(product);
      } else {
        next({
          status: 400,
          message: 'Unable to find the product',
        });
      }
    } catch (error) {
      next(error);
    }
  })
  .delete((req, res, next) => {});

export default router;
