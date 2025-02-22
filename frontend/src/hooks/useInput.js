import {useState} from 'react';

export function useInput(defaultValue, validationFn) {
	const [enteredValue, setFormDataState] = useState(defaultValue);
	const [didEdit, setDidEdit] = useState(false);

	const valueIsValid = validationFn(enteredValue);

	// Update on keystroke
	const handleChange = (e) => {
		setFormDataState(e.target.value);
		setDidEdit(false);
	};

	const handleReset = () => {
		setFormDataState(defaultValue);
		setDidEdit(false);
	};

	const handleBlur = () => {
		setDidEdit(true);
	};

	return {
		value: enteredValue,
		handleChange,
		handleBlur,
		handleReset,
		hasError: didEdit && !valueIsValid, // When user stopped editing and input isn't valid
	};
}
