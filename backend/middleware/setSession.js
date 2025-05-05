import 'dotenv/config';
import MySQLStoreFactory from 'express-mysql-session';
import session from 'express-session';

//! not sequelize?
const options = {
  host: process.env.SQLSTORE_HOST,
  port: Number(process.env.SQLSTORE_PORT),
  user: process.env.SQLSTORE_USER,
  password: process.env.SQLSTORE_PASS,
  database: process.env.SQLSTORE_DB,
  createDatabaseTable: true,
};

const MySQLStore = MySQLStoreFactory(session);
const sessionStore = new MySQLStore(options);

// secret is used for signing the hash, resave:false - session will not be saved on every request, saveUninitialized: false - that it won't be saved if nothing is stored in this session
export const setSession = session({
  key: 'session_CID',
  // ! to change
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 86400000, // 1 day in milliseconds
    // httpOnly: true,
    // secure: false,
    // sameSite: 'lax'
  },
});
