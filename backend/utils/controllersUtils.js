import columnMaps from './columnsMapping.js';
import { formatIsoDateTime } from './dateUtils.js';
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
// util pass validation
export const isPassValidForSchedule = (pass, schedule) => {
  // 1. Is active?
  if (pass.status !== 'active') return false;

  // 2. Is defined?
  if (!pass.PassDefinition) return false;
  const passDef = pass.PassDefinition;

  // 3. Is matching requested schedule?
  if (!schedule.Product || !schedule.Product.type) return false;
  if (!passDef.allowedProductTypes) return false;
  const allowedTypes = passDef.allowedProductTypes.split(','); // ["class","online"]
  if (!allowedTypes.includes(schedule.Product.type)) return false;

  // 4. Is expired?
  const now = new Date();
  if (pass.validUntil && now > pass.validUntil) {
    return false;
  }

  // 5. Is started?
  if (pass.validFrom && now < pass.validFrom) {
    return false;
  }

  // 6. Is count type
  if (passDef.passType === 'count' && pass.usesLeft <= 0) return false;

  // All good - valid
  return pass;
};
