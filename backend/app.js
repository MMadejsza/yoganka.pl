import express from 'express';
import session from 'express-session';
import MySQLStoreFactory from 'express-mysql-session';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// middleware funnels
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const options = {
	host: 'localhost',
	port: 3306,
	user: 'admin1',
	password: 'admin1',
	database: 'yoganka',
};

const MySQLStore = MySQLStoreFactory(session);
const sessionStore = new MySQLStore(options);

app.use(
	session({
		key: 'session_CID',
		// secret is used for signing the hash, resave:false - session will not be saved on every request, saveUninitialized: false - that it won't be saved if nothing is stored in this session
		// ! to change
		secret: 'my secret',
		resave: false,
		saveUninitialized: false,
		store: sessionStore,
		cookie: {
			maxAge: 86400000, // 1 day in milisekundach
			// httpOnly: true,    // Protect from the access from the JavaScript
			// secure: false,     // Set to true if you use HTTPS
			// sameSite: 'lax'    // Extra security from CSRF
		},
	}),
);

// Filtering that works only for /admin/*
app.use(`/login-pass`, authRoutes);
app.use(`/admin-console`, adminRoutes);
app.use(`/customer`, customerRoutes);
app.use(`/user`, userRoutes);

app.use((req, res) => {
	res.status(404).send(`<h1>Page not found</h1>`);
});

app.listen(3000, () => console.log('🚀 Backend works on http://localhost:3000'));
