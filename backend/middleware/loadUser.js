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

      //  Check each customer pass for expiration conditions.
      if (
        userInstance?.Customer?.CustomerPasses &&
        Array.isArray(userInstance.Customer.CustomerPasses)
      ) {
        const now = new Date();

        const updatePromises = userInstance.Customer.CustomerPasses.map(
          passInstance => {
            // If already -1 - do nothing
            if (passInstance.status !== -1) {
              // Expired
              const isExpiredByDate =
                passInstance.validUntil &&
                new Date(passInstance.validUntil) < now;
              // UsesLeft = 0.
              const passType =
                passInstance?.PassDefinition?.passType.toUpperCase();
              const isCountPass = passType === 'COUNT' || passType === 'MIXED';
              const isExpiredByUses = isCountPass && passInstance.usesLeft <= 0;

              if (isExpiredByDate || isExpiredByUses) {
                // Update
                return passInstance.update({ status: -1 });
              }
            }
            // Make sure every iteration return promise
            return Promise.resolve();
          }
        );
        // Wait for all updates before returning userInstance
        return Promise.all(updatePromises).then(() => userInstance);
      }
      return userInstance;
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
