import express from 'express';
import adminRoutes from './routes/adminRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// middleware funnels
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(express.static(path.join(rootDir, '../../frontend/public')));

// Filtering that works only for /admin/*
app.use(`/admin-console`, adminRoutes);
app.use(`/customer`, customerRoutes);
app.use(`/user`, userRoutes);

app.use((req, res) => {
	res.status(404).send(`<h1>Page not found</h1>`);
});

app.listen(3000, () => console.log('🚀 Backend works on http://localhost:3000'));
