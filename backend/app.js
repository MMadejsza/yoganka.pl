import express from 'express';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// middleware funnels
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// secret is used for signing the hash, resave:false - session will not be saved on every request, saveUninitialized: false - that it won't be saved if nothing has changed
app.use(
	session({
		secret: 'my secret',
		resave: false,
		saveUninitialized: false,
		cookie: {maxAge: 86400000}, // 1 day in milliseconds
	}),
);
// app.use(express.static(path.join(rootDir, '../../frontend/public')));

// Filtering that works only for /admin/*
app.use(`/login-pass`, authRoutes);
app.use(`/admin-console`, adminRoutes);
app.use(`/customer`, customerRoutes);
app.use(`/user`, userRoutes);

app.use((req, res) => {
	res.status(404).send(`<h1>Page not found</h1>`);
});

app.listen(3000, () => console.log('🚀 Backend works on http://localhost:3000'));
