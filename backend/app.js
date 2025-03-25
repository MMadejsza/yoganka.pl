import csurf from 'csurf';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import isAuth from './middleware/is-auth-admin.js';
import { loadUserFromSession } from './middleware/loadUser.js';
import { setLocals } from './middleware/setLocals.js';
import { setSession } from './middleware/setSession.js';

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

app.use(setSession);

// All the post/put/delete methods will be looking for the token now
const csrfProtection = csurf();
app.use(csrfProtection);

app.use(loadUserFromSession);

// data for rendering conditionals and rules (frontend)
app.use(setLocals);

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
