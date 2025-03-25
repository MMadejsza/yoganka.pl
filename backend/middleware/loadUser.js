import * as models from '../models/_index.js';

export const loadUserFromSession = (req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  models.User.findByPk(req.session.user.UserID, {
    include: [
      {
        model: models.Customer, // Add Customer
        required: false, // May not exist
      },
      {
        model: models.UserPrefSettings, // User settings if exist
        required: false,
      },
    ],
  })
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
};
