const userRoutes = require('./users');
const apiUserRoutes = require('./api/users');
const apiPostRoutes = require('./api/posts');
const apiCommentRoutes = require('./api/comments');
const express = require('express');
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
  res.render('index', req.query);
});

module.exports = {
  userRoutes,
  apiUserRoutes,
  apiPostRoutes,
  apiCommentRoutes,
  indexRoutes: router,
};
