import connectPgSimple from 'connect-pg-simple';
import 'dotenv/config';
import session from 'express-session';
import pkg from 'pg';

const { Pool } = pkg;
const PgSession = connectPgSimple(session);

// this creates a separate connection pool just for session storage
// it's not connected to your Sequelize setup
const pgPool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: false, // set to true when using https in production (e.g. Render)
});

// here we initialize express-session with connect-pg-simple as the store
// it will save sessions in the "session" table in your PostgreSQL database
export const setSession = session({
  store: new PgSession({
    pool: pgPool,
    tableName: 'session', // this is the default name, but you can change it
    createTableIfMissing: true, // this creates the table automatically if it doesn't exist
  }),
  secret: process.env.SESSION_SECRET, // used to sign the session cookie
  resave: false, // don't save the session if nothing changed
  saveUninitialized: false, // don't save new sessions unless something was added
  cookie: {
    maxAge: 86400000, // session cookie valid for 1 day
    sameSite: 'lax', // helps with csrf protection, still allows form submits
    httpOnly: true, // prevents client-side js from reading the cookie
    secure: false, // set to true when using https (important for production)
  },
});
