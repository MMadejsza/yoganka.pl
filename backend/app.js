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

// Use helmet to secure HTTP headers
//! FOR FURTHER CONFIG
app.use(helmet());

// Parse incoming JSON and URL-encoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log each incoming request for debugging purposes
app.use((req, res, next) => {
  console.log(`\n➡️➡️➡️  Request: ${req.method} ${req.url}`);
  next();
});

// Initialize and configure session middleware using MySQL as the session store. This creates a session for each client, which will be used for authentication, CSRF protection, etc.
app.use(setSession);

// Enable CSRF protection for all POST/PUT/DELETE requests. This will look for a valid CSRF token in the requests.
const csrfProtection = csurf();
app.use(csrfProtection);

// Load the full user data from the database based on the session data. This the fetched user object to req.user for further processing.
app.use(loadUserFromSession);

// Set local variables for rendering logic or conditions in the frontend. These variables (such as isLoggedIn, role, csrfToken) are easily available in the response object res.
app.use(setLocals);

// Define route groups for different parts of the application:
app.use(`/login-pass`, authRoutes);
app.use(`/admin-console`, isAuth, adminRoutes);
app.use(`/customer`, customerRoutes);
app.use(`/`, userRoutes);

// Central error handling middleware.
// This catches errors from previous middleware/routes, logs the stack trace, and sends a JSON error response with an appropriate status code.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .send({ message: err.message || 'Internal Server Error' });
});

// Handle 404 errors when no route matches the request.
app.use((req, res) => {
  res.status(404).send(`<h1>Page not found</h1>`);
});

// Synchronize database models (with alter:true to adjust tables as needed) and then start the server on port 3000.
db.sync().then(() => {
  app.listen(3000, () =>
    console.log('🚀🚀🚀🚀🚀 Backend works on http://localhost:3000 🚀🚀🚀🚀🚀')
  );
});
