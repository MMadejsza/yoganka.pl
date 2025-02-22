export const isEmail = (value) => {
	// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	return value.includes('@');
};
export const isNotEmpty = (value) => {
	return value.trim() !== '';
};
export const hasMinLength = (value, minLength) => {
	return value.length >= minLength;
};
export const equalsToOtherValue = (value, otherValue) => {
	return value === otherValue;
};
