import csurf from 'csurf';
import 'dotenv/config';
import express from 'express';
import MySQLStoreFactory from 'express-mysql-session';
import session from 'express-session';
import helmet from 'helmet';
import isAuth from './middleware/is-auth-admin.js';
import * as models from './models/_index.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import userRoutes from './routes/userRoutes.js';
import db from './utils/db.js';

const app = express();
app.use(helmet()); // for HTTP Heading protection

// middleware funnels
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`\n➡️➡️➡️  Request: ${req.method} ${req.url}`);
  next();
});

//! not sequelize?
const options = {
  host: process.env.SQLSTORE_HOST,
  port: Number(process.env.SQLSTORE_PORT),
  user: process.env.SQLSTORE_USER,
  password: process.env.SQLSTORE_PASS,
  database: process.env.SQLSTORE_DB,
};

const MySQLStore = MySQLStoreFactory(session);
const sessionStore = new MySQLStore(options);

app.use(
  session({
    key: 'session_CID',
    // secret is used for signing the hash, resave:false - session will not be saved on every request, saveUninitialized: false - that it won't be saved if nothing is stored in this session
    // ! to change
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 86400000, // 1 day in milliseconds
      // httpOnly: true,    // Protect from the access from the JavaScript
      // secure: false,     // Set to true if you use HTTPS
      // sameSite: 'lax'    // Extra security from CSRF
    },
  })
);

// All the post/put/delete methods will be looking for the token now
const csrfProtection = csurf();
app.use(csrfProtection);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  models.User.findByPk(req.session.user.UserID, {
    include: [
      {
        model: models.Customer, // Add Customer
        required: false, // May not exist
      },
      {
        model: models.UserPrefSettings, // User settings if exist
        required: false,
      },
    ],
  })
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.role = req.session.role;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Filtering that works only for /admin/*
app.use(`/login-pass`, authRoutes);
app.use(`/admin-console`, isAuth, adminRoutes);
app.use(`/customer`, customerRoutes);
app.use(`/`, userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .send({ message: err.message || 'Internal Server Error' });
});

app.use((req, res) => {
  res.status(404).send(`<h1>Page not found</h1>`);
});

db.sync({ alter: true }).then(() => {
  app.listen(3000, () =>
    console.log('🚀🚀🚀🚀🚀 Backend works on http://localhost:3000 🚀🚀🚀🚀🚀')
  );
});
