import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
	res.send(`<a href='/add-product'>express</a>`);
});

export default router;
