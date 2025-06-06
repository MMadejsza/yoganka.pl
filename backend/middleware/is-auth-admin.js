export default (req, res, next) => {
  if (!res.locals.isLoggedIn && res.locals.role.toUpperCase() != 'ADMIN') {
    return res.status(401).json({ message: 'unauthorized' });
  }
  next();
};
