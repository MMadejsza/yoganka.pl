import express from 'express';

const router = express.Router();

//  /admin/* => GET
router.get('/add-product', (req, res, next) => {
	res.send(`
    <a href="/admin/product" target="_blank" rel="noopener noreferrer"></a>`);
});
router.post('/product', (req, res) => {
	console.log(req.body);
	res.redirect('/');
});

//  /admin/* => POST
router.post('/ex', (req, res) => {
	console.log('Got in backend:', req.body);
	res.json({message: 'Backend go data!'});
});

export default router;
