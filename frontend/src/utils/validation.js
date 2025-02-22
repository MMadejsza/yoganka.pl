//! EMAIL RULESET
export const emailValidations = [
	{
		// if empty
		rule: (value) => value.trim() !== '',
		message: 'Email nie może być pusty',
	},
	{
		// if no @
		rule: (value) => value.includes('@'),
		message: 'Musi mieć "@"',
	},
	{
		// if doesn't follow simple format name@domain.com
		rule: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
		message: 'Musi być w formacie jan@domena.com',
	},
];
//! PASSWORD RULESET
export const passwordValidations = [
	{
		// if shorter than 8
		rule: (value) => hasMinLength(value, 8),
		message: 'Hasło musi mieć min 8 znaków',
	},
];
//! CONFIRM PASSWORD RULESET
//  must be function to be able to pass other input value (1st password)
export const getConfirmedPasswordValidations = (passwordValue) => [
	{
		// if not equal
		rule: (value) => equalsToOtherValue(value, passwordValue),
		message: 'Hasła nie są identyczne',
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
