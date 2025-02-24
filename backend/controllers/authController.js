export const postLogin = (req, res, next) => {
	req.session.isLoggedIn = true;
	console.log('received login:', req.body);
	res.json({success: true});
};
export const postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log('postLogout');
		console.log(err);
		return res.json({success: true});
	});
};
