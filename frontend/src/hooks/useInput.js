import {useState} from 'react';

export function useInput(defaultValue, validations) {
	const [enteredValue, setEnteredValue] = useState(defaultValue); // state for value
	const [isFocused, setIsFocused] = useState(false); // state to catch if editing has started
	const [didEdit, setDidEdit] = useState(false); // state to catch if editing has ended

	const handleChange = (e) => {
		setEnteredValue(e.target.value); // update on keystroke
	};

	const handleReset = () => {
		setEnteredValue(defaultValue);
		setDidEdit(false); // notify no edited yet
		setIsFocused(false); // notify no edited yet
	};

	const handleFocus = () => {
		setIsFocused(true);
	};

	const handleBlur = () => {
		setIsFocused(false); // notify editing finish
		setDidEdit(true); // notify editing finish
	};

	// Check array of rules to create the list of eventual messages
	const validationResults = validations.map((validation) => ({
		valid: validation.rule(enteredValue),
		message: validation.message,
	}));

	// error flag if some of the rules are valuated
	// const hasError = didEdit && validationResults.some((result) => !result.valid);
	const hasError = validationResults.some((result) => !result.valid);

	return {
		value: enteredValue,
		handleChange,
		handleFocus,
		handleBlur,
		handleReset,
		isFocused,
		didEdit,
		validationResults,
		hasError,
	};
}
