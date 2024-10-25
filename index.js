const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const routes = require('./routes');
const app = express();
const PORT = 3000;

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./assets'));
app.use(morgan('tiny'));
// routes set up
app.use(routes.indexRoutes);
app.use('/users', routes.userRoutes);
app.use('/api/users', routes.apiUserRoutes);
app.use('/api/posts', routes.apiPostRoutes);
app.use('/api/comments', routes.apiCommentRoutes);
app.use('/api', (err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

app.engine('dc', (filePath, options, callback) => {
  fs.readFile(filePath, (err, tpl) => {
    if (err) {
      return callback(err);
    } else {
      const rendered = tpl
        .toString()
        .replaceAll('#title#', options.title)
        .replace('#content#', options.content);

      return callback(null, rendered);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}.`);
});
