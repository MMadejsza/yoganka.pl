import { useEffect, useState } from 'react';
import { applyFontSize } from '../utils/userSettingsUtils';

export function useInput(defaultValue, validations) {
  const [enteredValue, setEnteredValue] = useState(
    defaultValue !== undefined ? defaultValue : ''
  ); // state for value
  const [isFocused, setIsFocused] = useState(false); // state to catch if editing has started
  const [didEdit, setDidEdit] = useState(false); // state to catch if editing has ended

  // Update on default value
  useEffect(() => {
    setEnteredValue(defaultValue !== undefined ? defaultValue : '');
  }, [defaultValue]);

  const handleChange = (e, settings) => {
    // IF defaultValue is boolean (checkbox), we use e.target.checked
    console.log('handleChange for', settings, 'value:', e.target.checked);
    if (typeof defaultValue === 'boolean') {
      setEnteredValue(e.target.checked);
    } else {
      setEnteredValue(e.target.value);
    } // update on keystroke

    if (settings === 'font') {
      applyFontSize(e.target.value.toLowerCase());
    }
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
  const validationResults = validations?.map(validation => ({
    valid: validation.rule(enteredValue),
    message: validation.message,
  }));

  // error flag if some of the rules are valuated
  // const hasError = didEdit && validationResults.some((result) => !result.valid);
  const hasError = validationResults?.some(result => !result.valid) || false;

  return {
    value: enteredValue,
    setValue: setEnteredValue,
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
