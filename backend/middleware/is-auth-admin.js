export default (req, res, next) => {
	if (!req.session.isLoggedIn && req.session.role.toUpperCase() != 'ADMIN') {
		return res.status(401).json({message: 'unauthorized'});
	}
	next();
};
