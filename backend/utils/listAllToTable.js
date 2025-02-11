import columnMaps from './columnsMapping.js';
import formatIsoDateTime from './formatDateTime.js';

export const simpleListAllToTable = (res, model) => {
	model
		.findAll()
		.then((records) => {
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

			return res.json({
				totalHeaders,
				content: formattedRecords,
			});
		})
		.catch((err) => console.log(err));
};

export const listAllToTable = (res, model, references) => {
	model
		.findAll(references)
		.then((records) => {
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
			res.json({
				totalHeaders, // To render
				content: formattedRecords, // With new names
			});
		})
		.catch((err) => console.log(err));
};
