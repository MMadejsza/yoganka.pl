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
    mapRecord,
    columnKeys,
    sortFunction,
    successMessage,
    notFoundMessage,
  }
) {
  return async (req, res, next) => {
    // Build controller name dynamically
    const controllerName = `getAll${EntityModel.name}`;
    // Log incoming request
    callLog(req, actorName, controllerName);
    let errorCode = 500;
    try {
      // Prepare Sequelize query options
      const queryOptions = { include: includeRelations };
      if (excludeFields.length) {
        queryOptions.attributes = { exclude: excludeFields };
      }
      // Execute database fetch
      const records = await EntityModel.findAll(queryOptions);
      // If none found, throw 404
      if (!records || records.length === 0) {
        errorCode = 404;
        throw new Error(notFoundMessage || `${EntityModel.name} not found.`);
      }
      // Map each record to plain object
      let formattedList = records.map(mapRecord);
      // Optionally sort the array
      if (typeof sortFunction === 'function') {
        formattedList = formattedList.sort(sortFunction);
      }
      // Log success
      successLog(actorName, controllerName);
      // Return standardized response
      return res.json({
        confirmation: 1,
        message: successMessage,
        columnKeys,
        content: formattedList,
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
    successMessage,
    notFoundMessage,
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
      const result = mapRecord(record);
      successLog(actorName, controllerName);
      // Return entity under its lowercase name
      return res.json({
        confirmation: 1,
        message: successMessage,
        [EntityModel.name.toLowerCase()]: result,
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
    primaryKey = `${EntityModel.name.toLowerCase()}Id`,
    successMessage,
    notFoundMessage,
  }
) {
  return async (req, res, next) => {
    const controllerName = `delete${EntityModel.name}`;
    callLog(req, actorName, controllerName);
    let errorCode = 500;
    try {
      const id = req.params.id;
      // Perform deletion
      const deletedCount = await EntityModel.destroy({
        where: { [primaryKey]: id },
      });
      if (!deletedCount) {
        errorCode = 404;
        throw new Error(notFoundMessage || `${EntityModel.name} not found.`);
      }
      successLog(actorName, controllerName);
      return res.json({ confirmation: 1, message: successMessage });
    } catch (err) {
      return catchErr(actorName, res, errorCode, err, controllerName);
    }
  };
}
