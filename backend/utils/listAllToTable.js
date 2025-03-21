import columnMaps from './columnsMapping.js';
import {formatIsoDateTime} from './formatDateTime.js';
import {errorCode, log, catchErr} from './controllersUtils.js';
let errCode = errorCode;

export const simpleListAllToTable = (res, model) => {
	const controllerName = 'simpleListAllToTable';
	log(controllerName);

	model
		.findAll()
		.then((records) => {
			if (!records) {
				errCode = 404;
				throw new Error('Nie znaleziono rekordów.');
			}
			// fetching map for User table or empty object
			const columnMap = columnMaps[model.name] || {};

			// Convert for records for different names
			const formattedRecords = records.map((record) => {
				const newRecord = {}; // Container for formatted data
				const attributes = model.getAttributes();
				const jsonRecord = record.toJSON();

				// 🔄 Iterate after each column in user record
				for (const key in jsonRecord) {
					const newKey = columnMap[key] || key; // New or original name if not specified
					const attributeType = attributes[key]?.type.constructor.key?.toUpperCase();
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
		.catch((err) => catchErr(err, controllerName));
};

export const listAllToTable = (res, model, references) => {
	const controllerName = 'listAllToTable';
	log(controllerName);
	model
		.findAll(references)
		.then((records) => {
			if (!records) {
				errCode = 404;
				throw new Error('Nie znaleziono rekordów.');
			}
			// fetching map for User table or empty object
			const columnMap = columnMaps[model.name] || {};

			// Convert for records for different names
			const formattedRecords = records.map((record) => {
				const newRecord = {}; // Container for formatted data

				// 🔄 Iterate after each column in user record
				for (const key in record.toJSON()) {
					const newKey = columnMap[key] || key; // New or original name if not specified
					newRecord[newKey] = record[key]; // Assignment
				}

				// ➕ Add new column
				if (record.FirstName && record.LastName) {
					newRecord['Imię Nazwisko'] = `${record.FirstName} ${record.LastName}`;
					delete newRecord['Imię'];
					delete newRecord['Nazwisko'];
				}
				console.log(newRecord);
				return newRecord; // Return new record object
			});

			// New headers (keys from columnMap)
			const totalHeaders = Object.keys(formattedRecords[0] || {});

			// ✅ Return response to frontend
			console.log('\n✅✅✅ listAllToTable fetched');
			res.json({
				confirmation: 1,
				message: 'Pobrano pomyślnie',
				totalHeaders, // To render
				content: formattedRecords, // With new names
			});
		})
		.catch((err) => catchErr(err, controllerName));
};
