export const setLocals = (req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.role = req.session.role;
  res.locals.csrfToken = req.csrfToken();
  next();
};
