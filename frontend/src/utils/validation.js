//! EMAIL RULESET
export const emailValidations = [
	{
		// if empty
		rule: (value) => value.trim() !== '',
		message: 'Nie może być pusty',
	},
	{
		// if no @
		rule: (value) => value.includes('@'),
		message: 'Zawiera "@"',
	},
	{
		// if doesn't follow simple format name@domain.com
		rule: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
		message: 'W formacie jan@domena.com',
	},
];
//! PASSWORD RULESET
export const passwordValidations = [
	{
		// if shorter than 8
		rule: (value) => hasMinLength(value, 8),
		message: 'Przynajmniej 8 znaków',
	},
	{
		rule: (value) => /[A-Z]/.test(value),
		message: 'Przynajmniej jedna wielka litera',
	},
	{
		rule: (value) => /[^a-zA-Z0-9]/.test(value),
		message: 'Przynajmniej jeden znak specjalny',
	},
];
//! CONFIRM PASSWORD RULESET
//  must be function to be able to pass other input value (1st password)
export const getConfirmedPasswordValidations = (passwordValue) => [
	{
		// if not equal
		rule: (value) => equalsToOtherValue(value, passwordValue),
		message: 'Musi być identyczne',
	},
];

//! HELPER FUNCTIONS
export const isNotEmpty = (value) => {
	return value.trim() !== '';
};
export const hasMinLength = (value, minLength) => {
	return value.length >= minLength;
};
export const equalsToOtherValue = (value, otherValue) => {
	return value === otherValue;
};
