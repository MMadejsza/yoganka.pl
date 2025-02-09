import express from 'express';
import path from 'path';
import rootDir from '../utils/dirPath.js';
import db from '../utils/db.js';

const router = express.Router();

router.use('/ex', (req, res) => {
	console.log('__dirname:', rootDir);
	console.log('path.join:', path.join(rootDir, '../views/1.html'));

	res.sendFile(path.join(rootDir, '..', 'views/1.html'));
});

router.get('/', (req, res) => {
	res.send(`<a href='/add-product'>express</a>`);
});

export default router;
