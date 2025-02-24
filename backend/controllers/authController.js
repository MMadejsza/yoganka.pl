export const getStatus = (req, res, next) => {
	if (req.session.isLoggedIn) {
		return res.json({isLoggedIn: true});
	}
	res.json({isLoggedIn: false});
};
export const postLogin = (req, res, next) => {
	req.session.isLoggedIn = true;
	console.log('received login:', req.body);
	res.json({success: true});
};
export const postLogout = (req, res, next) => {
	console.log('postLogout 1');

	req.session.destroy((err) => {
		console.log('postLogout');
		if (err) {
			return next(err);
		}
		res.clearCookie('session_CID');
		res.json({success: true});
	});
};
