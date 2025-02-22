import {useState} from 'react';

export function useInput(defaultValue, validations) {
	const [enteredValue, setEnteredValue] = useState(defaultValue); // state for value
	const [didEdit, setDidEdit] = useState(false); // state to catch id editing has ended

	const handleChange = (e) => {
		setEnteredValue(e.target.value); // update on keystroke
	};

	const handleReset = () => {
		setEnteredValue(defaultValue);
		setDidEdit(false); // notify editing finish
	};

	const handleBlur = () => {
		setDidEdit(true);
	};

	// Check array of rules to create the list of eventual messages
	const validationResults = validations.map((validation) => ({
		valid: validation.rule(enteredValue),
		message: validation.message,
	}));

	// error fla if some of the rules are valuated
	const hasError = didEdit && validationResults.some((result) => !result.valid);

	return {
		value: enteredValue,
		handleChange,
		handleBlur,
		handleReset,
		didEdit,
		validationResults,
		hasError,
	};
}
