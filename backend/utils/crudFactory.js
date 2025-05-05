// utils/crudFactory.js
// Generic CRUD controller factories for maximum modularity

import { callLog, catchErr, successLog } from './debuggingUtils.js';

/**
 * Factory for "Get All" controllers.
 * Creates an async handler to load all records of a model,
 * format them, and return with a standard JSON shape.
 *
 * @param {string} actorName - Who is performing the action (for logs).
 * @param {object} EntityModel - Sequelize model class.
 * @param {object} options
 * @param {array}  options.includeRelations - Sequelize include definitions.
 * @param {array}  options.excludeFields   - Model attributes to exclude from results.
 * @param {function} options.mapRecord     - Callback to map each record to a plain object.
 * @param {array}  options.columnKeys      - Keys for table headers in response.
 * @param {function} [options.sortFunction] - Optional function to sort the list.
 * @param {string} options.successMessage  - Message on successful fetch.
 * @param {string} [options.notFoundMessage] - Message if no records found.
 *
 * Usage:
 * export const getAllUsers = createGetAll('Admin', models.User, {
 *   includeRelations: [...],
 *   excludeFields: ['passwordHash'],
 *   mapRecord: user => ({ rowId: user.id, ...user.toJSON() }),
 *   columnKeys: ['id','email','role'],
 *   successMessage: 'Users loaded 😊',
 *   notFoundMessage: 'No users found 😢'
 * });
 */
export function createGetAll(
  actorName,
  EntityModel,
  {
    includeRelations = [],
    excludeFields = [],
    where,
    preAction, //optional async hook before fetching
    postAction, // optional runs after successful fetching
    mapRecord,
    columnKeys,
    sortFunction,
    successMessage,
    notFoundMessage,
  }
) {
  return async (req, res, next) => {
    // Build controller name dynamically
    const controllerName = `getAll${EntityModel.name}s`;
    // Log incoming request
    callLog(req, actorName, controllerName);
    let errorCode = 500;
    try {
      // run preAction (e.g. to fetch schedule)
      let hookData;
      if (typeof preAction === 'function') {
        hookData = await preAction(req);
      }

      // set up query options
      const queryOptions = { include: includeRelations };
      if (excludeFields.length) {
        queryOptions.attributes = { exclude: excludeFields };
      }
      if (where) {
        // function returning object or object
        queryOptions.where =
          typeof where === 'function' ? where(hookData, req) : where;
      }

      // fetch all records
      const records = await EntityModel.findAll(queryOptions);
      if (!records || records.length === 0) {
        errorCode = 404;
        throw new Error(notFoundMessage || `${EntityModel.name}s not found.`);
      }

      // map + filter
      let list = records
        .map(inst => mapRecord(inst.toJSON(), hookData))
        .filter(item => item != null); // allow mapRecord to drop items

      // optional sorting
      if (typeof sortFunction === 'function') {
        list = list.sort(sortFunction);
      }

      successLog(actorName, controllerName);
      return res.json({
        confirmation: 1,
        message: successMessage,
        columnKeys,
        content: list,
      });
    } catch (err) {
      // Central error handler
      return catchErr(actorName, res, errorCode, err, controllerName);
    }
  };
}

/**
 * Factory for "Get by ID" controllers.
 * Loads a single record by primary key and returns it.
 *
 * @param {string} actorName
 * @param {object} EntityModel
 * @param {object} options
 * @param {array} options.includeRelations
 * @param {array} options.excludeFields
 * @param {function} [options.mapRecord] - Maps the Sequelize instance to JSON.
 * @param {string} options.successMessage
 * @param {string} [options.notFoundMessage]
 */
export function createGetById(
  actorName,
  EntityModel,
  {
    includeRelations = [],
    excludeFields = [],
    mapRecord = instance => instance.toJSON(),
    postAction,
    successMessage,
    notFoundMessage,
    attachResponse = () => ({}), // for isLoggedIn etc.
    resultName = EntityModel.name.toLowerCase(),
  }
) {
  return async (req, res, next) => {
    const controllerName = `get${EntityModel.name}ById`;
    callLog(req, actorName, controllerName);
    let errorCode = 500;
    try {
      // Determine ID: URL param or logged-in user
      const id = req.params.id || req.user?.userId;
      const queryOptions = { include: includeRelations };
      if (excludeFields.length) {
        queryOptions.attributes = { exclude: excludeFields };
      }
      // Fetch single record
      const record = await EntityModel.findByPk(id, queryOptions);
      if (!record) {
        errorCode = 404;
        throw new Error(notFoundMessage || `${EntityModel.name} not found.`);
      }
      // Apply mapping
      const result = await mapRecord(record);

      if (typeof postAction === 'function') {
        await postAction(req, result);
      }

      successLog(actorName, controllerName);
      // Return entity under its lowercase name
      return res.json({
        confirmation: 1,
        message: successMessage,
        ...attachResponse(req, result),
        [resultName]: result,
      });
    } catch (err) {
      return catchErr(actorName, res, errorCode, err, controllerName);
    }
  };
}

/**
 * Factory for "Delete by ID" controllers.
 * Deletes a record and returns confirmation.
 *
 * @param {string} actorName
 * @param {object} EntityModel
 * @param {object} options
 * @param {string} options.primaryKey - Field name of the primary key in the model.
 * @param {string} options.successMessage
 * @param {string} [options.notFoundMessage]
 */
export function createDelete(
  actorName,
  EntityModel,
  {
    primaryKeyName = `${EntityModel.name.toLowerCase()}Id`,
    preAction, // optional hook: runs before delete
    postAction, // optional hook: runs after successful delete
    successMessage,
    notFoundMessage,
  }
) {
  return async (req, res, next) => {
    const controllerName = `delete${EntityModel.name}`;
    callLog(req, actorName, controllerName);
    let errorCode = 500;

    try {
      // run the preAction hook if provided (e.g. find entity, pull out email)
      let hookData;
      if (typeof preAction === 'function') {
        hookData = await preAction(req);
      }

      const id = req.params.id;
      // Perform deletion
      const deletedCount = await EntityModel.destroy({
        where: { [primaryKeyName]: id },
      });

      if (!deletedCount) {
        errorCode = 404;
        throw new Error(notFoundMessage || `${EntityModel.name} not found.`);
      }

      // run the postAction hook if provided (e.g. send notification)
      if (typeof postAction === 'function') {
        await postAction(hookData, req);
      }

      successLog(actorName, controllerName);
      return res.json({ confirmation: 1, message: successMessage });
    } catch (err) {
      // respect err.status if set in preAction
      if (err.status && Number.isInteger(err.status)) {
        errorCode = err.status;
      }
      return catchErr(actorName, res, errorCode, err, controllerName);
    }
  };
}
