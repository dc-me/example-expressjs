import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import cors from 'cors';
import './utils/local-strategy.js';
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

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true, // ! important
  // methods: ["GET", "POST"],
};

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('./assets'));
app.use(morgan('tiny'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }, // works only on https
  })
);
app.use(passport.initialize());
app.use(passport.session());
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
