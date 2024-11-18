import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import configureRoutes from './routes/index.js';
const app = express();
const PORT = process.env.PORT || 3000;

// mongoose database connect
try {
  await mongoose.connect(process.env.MONGOOSE_URI, {
    autoIndex: false,
  });
} catch (err) {
  console.error(err);
}
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('./assets'));
app.use(morgan('tiny'));
// routes set up
configureRoutes(app);

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
