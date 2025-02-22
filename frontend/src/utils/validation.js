export const emailValidations = [
	{
		rule: (value) => value.trim() !== '',
		message: 'Email nie może być pusty',
	},
	{
		rule: (value) => value.includes('@'),
		message: 'Musi mieć "@"',
	},
	{
		rule: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
		message: 'Musi być w formacie jan@domena.com',
	},
];
export const passwordValidations = [
	{
		rule: (value) => hasMinLength(value, 8),
		message: 'Hasło musi mieć min 8 znaków',
	},
	// {
	// 	rule: (value) => value.includes('@'),
	// 	message: 'Musi mieć "@"',
	// },
	// {
	// 	rule: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
	// 	message: 'Musi być w formacie jan@domena.com',
	// },
];
export const isNotEmpty = (value) => {
	return value.trim() !== '';
};
export const hasMinLength = (value, minLength) => {
	return value.length >= minLength;
};
export const equalsToOtherValue = (value, otherValue) => {
	return value === otherValue;
};
