// !HELPERS
export const errorCode = 500;
export const log = (person, controllerName) => {
	console.log(`\n➡️➡️➡️ ${person} called ${controllerName}`);
};
export const catchErr = (res, errCode, err, controllerName, extraProps = {}) => {
	console.log(`\n❌❌❌ Error Admin ${controllerName}`, err.message);
	return res.status(errCode).json({
		confirmation: 0,
		message: err.message,
		...extraProps, // type: 'signup', code: 409,
	});
};
