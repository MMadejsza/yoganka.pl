import express from 'express';

const router = express.Router();

router.get('/add-product', (req, res, next) => {
	res.send(`
    <form action="/product" method="POST" >
    <input type="text" name="title"/>
    <button type="submit">submit</button>
    </form>`);
});
router.get('/product', (req, res) => {
	console.log(req.body);
	res.redirect('/');
});

router.post('/ex', (req, res) => {
	console.log('Got in backend:', req.body);
	res.json({message: 'Backend go data!'});
});

export default router;
