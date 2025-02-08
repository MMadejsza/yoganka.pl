import express from 'express';
import adminRoutes from './routes/admin.js';
import customerRoutes from './routes/customer.js';
// import path from 'path';
// import rootDir from './utils/dirPath.js';

const app = express();

// middleware funnels
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(express.static(path.join(rootDir, '../../frontend/public')));

// Filtering that works only for /admin/*
app.use(`/admin`, adminRoutes);
app.use(`/customer`, customerRoutes);

app.use((req, res) => {
	res.status(404).send(`<h1>Page not found</h1>`);
});

app.listen(3000);
