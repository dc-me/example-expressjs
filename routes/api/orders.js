import express from 'express';
import Order from '../../models/Order.js';
import User from '../../models/User.js';
import Product from '../../models/Product.js';
const router = express.Router();

router
  .route('/')
  .get(async (req, res, next) => {
    let page = Number(req.query.page);
    let size = Number(req.query.size);
    page = isNaN(page) ? 0 : page;
    size = isNaN(size) ? 10 : size;

    try {
      const orders = await Order.find()
        .skip(page * size)
        .limit(size)
        .populate('products');

      res.json(orders);
    } catch (error) {
      next(error);
    }
  })
  .post(async (req, res, next) => {
    // in oder to place an order we need userId and productIds
    // usually the user will be the logged in user, we'll just get the first user from data base

    try {
      const user = await User.findOne();
      const productIds = req.body.productIds;

      // check if the products id is valid
      if (
        productIds.length !==
        (await Product.countDocuments({ _id: { $in: productIds } }))
      ) {
        return next({ status: 400, message: 'Product does not exit.' });
      }

      const order = await new Order({
        user: user._id,
        products: productIds,
      }).save();

      res.json(order);
    } catch (error) {
      next(error);
    }
  });

router
  .route('/:id')
  .get(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id).populate('products');
      if (order) {
        res.json(order);
      } else {
        next({
          status: 404,
          message: `Could not find order by id "${req.params.id}"`,
        });
      }
    } catch (error) {
      next(error);
    }
  })
  .patch(async (req, res, next) => {
    // update order status
    try {
      const order = await Order.findById(req.params.id);
      if (order) {
        order.status = req.body.status;
        await order.save();
        res.json(order);
      } else {
        next({
          status: 404,
          message: `Order with id ${req.params.id} does not exist.`,
        });
      }
    } catch (error) {
      next(error);
    }
  });

export default router;
