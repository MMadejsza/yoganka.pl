import * as models from '../models/_index.js';

export const loadUserFromSession = (req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  return models.User.findByPk(req.session.user.userId, {
    include: [
      {
        model: models.Customer, // Add Customer
        required: false, // May not exist
        include: [
          {
            model: models.CustomerPass, // Add his passes
            required: false, // May not exist
            include: [
              {
                model: models.PassDefinition, // Their definitions
                required: false, // May not exist
              },
            ],
          },
        ],
      },
      {
        model: models.UserPrefSetting, // User settings if exist
        required: false,
        attributes: {
          exclude: ['userId', 'user_id'], // deleting
        },
      },
    ],
    attributes: {
      exclude: ['passwordHash'],
    },
  })
    .then(userInstance => {
      if (!userInstance) return next();
      let user = userInstance.toJSON();

      if (user.Customer === null) {
        delete user.Customer;
      }
      req.user = user;
      return next();
    })
    .catch(err => {
      console.error(err);
      return next(err);
    });
};
