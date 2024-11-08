/**
 * Seed test data to database
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const users = [
  {
    name: {
      firstName: 'Dany',
      lastName: 'Chen',
    },
    username: 'dany',
    email: 'dany@ulab.com',
    password: 'superstrongpassword',
  },
  {
    name: {
      firstName: 'Test',
      lastName: 'Doe',
    },
    username: 'test',
    email: 'test@test.com',
    password: 'superstrongpassword',
  },
  {
    name: {
      firstName: 'Jone',
      lastName: 'Doe',
    },
    username: 'jone',
    email: 'jone@test.com',
    password: 'superstrongpassword',
  },
  {
    name: {
      firstName: 'Alex',
      lastName: 'Hu',
    },
    username: 'alex',
    email: 'alex@test.com',
    password: 'superstrongpassword',
  },
  {
    name: {
      firstName: 'Amy',
      lastName: 'Muller',
    },
    username: 'amy',
    email: 'amy@test.com',
    password: 'superstrongpassword',
  },
];

const products = [
  {
    name: 'A cat',
    price: 100,
    picture: 'http://localhost:3000/images/cat.jpg',
    description: 'A fluffy fat cat',
  },
  {
    name: 'A Framework 13 laptop',
    price: 1000,
    picture: 'http://localhost:3000/images/laptop.jpg',
    description:
      'The Framework 13 is an eco-friendly, reparable, upgradable, modular laptop made by Framework Computer; a small computer company founded four years ago with this modular, repairable, eco-friendly mindset. Right to repair is strongly supported by Framework, and on their “About Us” page, they state “We know consumer electronics can be better for you and for the environment. Unlike most products, ours are open for you to repair and upgrade.” And all these things are true, with Framework going to the point of releasing their BIOS and other schematics and drawings open source.',
  },
];

try {
  await mongoose
    .connect(process.env.MONGOOSE_URI)
    .then(() => console.log('Connected to eshop database.'));

  // clean up before populate
  await User.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});
  // user data population
  const createdUsers = await User.create(users);
  // product data population
  const createdProducts = await Product.create(products);
  // order data population
  const order = new Order({
    user: createdUsers[0]._id,
    products: [createdProducts[0]._id, createdProducts[1]._id],
  });
  await order.save();
  console.log(await order.populate(['products', 'user']));
} catch (error) {
  console.error(error);
} finally {
  mongoose.connection.close();
}
