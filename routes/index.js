import express from 'express';
import userRoutes from './users.js';
import apiUserRoutes from './api/users.js';
import apiPostRoutes from './api/posts.js';
import apiCommentRoutes from './api/comments.js';
import apiProductRoutes from './api/products.js';
import apiOrderRoutes from './api/orders.js';
import apiGradeRoutes from './api/grades.js';
import apiV2UserRoutes from './api/v2/users.js';
import posts from '../db/posts.js';
const router = express.Router();

router.get('/dany', (req, res) => {
  const options = {
    title: 'Rendering Views with Express',
    content:
      "Here, we've created a basic template engine using <code>app.engine()</code> \
      and the <code>fs</code> module, then used <code>res.render</code> to \
      render this page using custom content within the template.<br><br> \
      Generally, you won't want to create your own view engines, \
      but it important to understand how they work behind the scenes. \
      For a look at some popular view engines, check out the documentation for \
      <a href='https://pugjs.org/api/getting-started.html'>Pug</a>, \
      <a href='https://www.npmjs.com/package/mustache'>Mustache</a>, or \
      <a href='https://www.npmjs.com/package/ejs'>EJS</a>. \
      More complete front-end libraries like React, Angular, and Vue \
      also have Express integrations.",
  };

  res.render('dany.dc', options);
});

router.get('/download/:id', (req, res) => {
  res.download(`./assets/images/${req.params.id}`);
});

router.get('/', (req, res) => {
  // query parameters
  res.render('index', {
    posts,
  });
});

export default function configure(app) {
  app.use(router);
  app.use('/users', userRoutes);
  app.use('/api/users', apiUserRoutes);
  app.use('/api/v2/users', apiV2UserRoutes);
  app.use('/api/posts', apiPostRoutes);
  app.use('/api/comments', apiCommentRoutes);
  app.use('/api/products', apiProductRoutes);
  app.use('/api/orders', apiOrderRoutes);
  app.use('/api/grades', apiGradeRoutes);
  app.use('/api', (err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });
  });
  // custom 404 middleware
  app.use((req, res) => {
    res.status(404).render('404');
  });
}
