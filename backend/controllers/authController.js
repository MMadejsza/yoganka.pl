export const postLogin = (req, res, next) => {
	req.session.isLoggedIn = true;
	// res.setHeader('Set-Cookie', 'loggedIn=true; Path=/; Max-Age=20');
	console.log('received login:', req.body);
	res.json({success: true});
};
