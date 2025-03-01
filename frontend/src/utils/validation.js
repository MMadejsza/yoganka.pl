//! PHONE RULESET
export const phoneValidations = [
	{
		// sprawdza, czy numer zawiera tylko dozwolone znaki: cyfry, spacje, myślniki, nawiasy i znak +
		rule: (value) => /^[+\d\s()-]+$/.test(value),
		message: 'Tylko cyfry, spacje, -, (), +',
	},
	{
		// wymuszamy podanie kierunkowego, czyli numer musi zaczynać się od "+"
		// wymuszamy podanie kierunkowego, czyli numer musi zaczynać się od "+"
		// i sprawdzamy, czy kierunkowy ma od 1 do 3 cyfr
		rule: (value) => {
			const trimmed = value.trim();
			const match = trimmed.match(/^\+(\d{1,3})/);
			return match !== null;
		},
		message: 'Numer kierunkowy (np. +48)',
	},
	{
		// walidacja długości numeru: liczymy same cyfry, wymagamy ich od 8 do 15
		rule: (value) => {
			const digits = value.replace(/\D/g, '');
			return digits.length >= 8 && digits.length <= 15;
		},
		message: '8 do 15 cyfr',
	},
];
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
		// if at least 1x capital letter
		rule: (value) => /[A-Z]/.test(value),
		message: 'Przynajmniej jedna wielka litera',
	},
	{
		// if at least 1x special character (^ negation -> of a-z, A-Z and umbers what defines character)
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
