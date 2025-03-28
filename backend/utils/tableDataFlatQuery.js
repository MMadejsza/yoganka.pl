import columnMaps from './columnsMapping.js';
import { formatIsoDateTime } from './formatDateTime.js';
import { callLog, catchErr, errorCode } from './loggingUtils.js';
let errCode = errorCode;
const person = 'table';

export const tableDataFlatQuery = (req, res, model) => {
  const controllerName = 'simpleListAllToTable';
  callLog(req, '?', controllerName);

  model
    .findAll()
    .then(records => {
      if (!records) {
        errCode = 404;
        throw new Error('Nie znaleziono rekordów.');
      }
      // fetching map for User table or empty object
      const columnMap = columnMaps[model.name] || {};

      // Convert for records for different names
      const formattedRecords = records.map(record => {
        const newRecord = {}; // Container for formatted data
        const attributes = model.getAttributes();
        const jsonRecord = record.toJSON();

        // 🔄 Iterate after each column in user record
        for (const key in jsonRecord) {
          const newKey = columnMap[key] || key; // New or original name if not specified
          const attributeType =
            attributes[key]?.type.constructor.key?.toUpperCase();
          if (
            (attributeType === 'DATE' ||
              attributeType === 'DATEONLY' ||
              attributeType === 'DATETIME') &&
            jsonRecord[key]
          ) {
            newRecord[newKey] = formatIsoDateTime(jsonRecord[key]);
          } else {
            newRecord[newKey] = jsonRecord[key]; // Assignment
          }
        }
        return newRecord;
      });

      // New headers (keys from columnMap)
      const totalHeaders = Object.keys(formattedRecords[0] || {});

      console.log('\n✅✅✅ simpleListAllToTable fetched');
      return res.json({
        totalHeaders,
        confirmation: 1,
        message: 'Pobrano pomyślnie',
        content: formattedRecords, //.sort((a, b) => new Date(b.Data) - new Date(a.Data)),
      });
    })
    .catch(err => catchErr(person, err, controllerName));
};
