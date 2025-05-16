function Input({
  formType,
  embedded,
  id,
  label,
  value,
  isFocused,
  didEdit,
  validationResults,
  isLogin,
  classModifier,
  isNotes,
  options,
  ...props
}) {
  let input;
  const inputClass = !embedded
    ? `${formType}-form__${id}-input`
    : `generic-details__content ${
        classModifier ? `generic-details__content--${classModifier}` : ''
      }  ${isNotes ? `generic-details__content--notes` : ''}`;
  const selectClass = !embedded
    ? `${formType}-form__${id}-input`
    : `generic-details__content ${
        classModifier ? `generic-details__content--${classModifier}` : ''
      }  ${isNotes ? `generic-details__content--notes` : ''}`;
  const textAreaClass = `${formType}-form__${id}-textarea`;

  if (props.type === 'checkbox') {
    if (options && Array.isArray(options)) {
      input = (
        <div className='checkbox-group'>
          {options.map((option, index) => (
            // Each option is rendered within a container div. If "embedded" is true,
            // we apply different classes.
            <div
              key={index}
              className={`${
                embedded
                  ? `generic-details__item ${
                      classModifier
                        ? `generic-details__item--${classModifier}`
                        : ''
                    } modal-checklist__li`
                  : 'input-pair'
              } ${props.type === 'tel' ? 'phone' : ''}`}
            >
              {/* Label for the checkbox */}
              <label htmlFor={`${id}_${index}`} className='checkbox-label'>
                {option.label}
              </label>
              {/* Checkbox input */}
              <input
                type='checkbox'
                id={`${id}_${index}`}
                name={id} // All checkboxes in the group share the same name
                value={option.value}
                // If "value" is an array, check if it includes the option's value;
                // otherwise, default to false.
                checked={
                  Array.isArray(value) ? value.includes(option.value) : false
                }
                onChange={props.onChange}
                onFocus={props.onFocus}
                onBlur={props.onBlur}
              />
            </div>
          ))}
        </div>
      );
    } else {
      input = (
        <input
          id={id}
          {...props}
          type='checkbox'
          checked={value}
          className={inputClass}
        />
      );
    }
  } else if (props.type == 'select') {
    const optionsArr = options.map((option, index) => (
      <option key={index} value={option.value}>
        {option.label}
      </option>
    ));
    input = (
      <select
        id={id}
        name={id}
        {...props}
        value={value}
        className={selectClass}
      >
        {optionsArr.length > 0
          ? optionsArr
          : [
              <option key={0} value={null}>
                Brak
              </option>,
            ]}
      </select>
    );
  } else if (props.type == 'textarea') {
    input = (
      <textarea
        id={id}
        name={id}
        {...props}
        value={value}
        className={textAreaClass}
      ></textarea>
    );
  } else if (props.type === 'radio') {
    input = (
      <div className='radio-group'>
        {options.map((option, index) => (
          <div
            key={index}
            className={`${
              embedded
                ? `generic-details__item ${
                    classModifier
                      ? `generic-details__item--${classModifier}`
                      : ''
                  } modal-checklist__li`
                : 'input-pair'
            } ${props.type == 'tel' ? 'phone' : ''}`}
          >
            <label
              key={index}
              htmlFor={`${id}_${index}`}
              className={`${
                embedded
                  ? `generic-details__label ${
                      classModifier
                        ? `generic-details__label--${classModifier}`
                        : ''
                    }`
                  : ''
              }`}
            />
            <input
              type='radio'
              id={`${id}_${index}`}
              name={id} // all radio with the same name are making the group
              value={option.value}
              checked={value === option.value}
              onChange={props.onChange}
              onFocus={props.onFocus}
              onBlur={props.onBlur}
            />
            {option.label}
          </div>
        ))}
      </div>
    );
  } else {
    input = <input id={id} {...props} value={value} className={inputClass} />;
  }

  // Compute if the field is empty: for array, check length; otherwise, use !value.
  const isEmpty = Array.isArray(value) ? value.length === 0 : !value;

  return (
    <div
      className={`${
        embedded
          ? `generic-details__item ${
              classModifier ? `generic-details__item--${classModifier}` : ''
            } modal-checklist__li`
          : 'input-pair'
      } ${props.type == 'tel' ? 'phone' : ''}`}
    >
      <label
        htmlFor={id}
        className={`${
          embedded
            ? `generic-details__label ${
                classModifier ? `generic-details__label--${classModifier}` : ''
              }`
            : ''
        }`}
      >
        {label}
      </label>

      {input}

      {/* After editing */}
      {!isLogin &&
        validationResults &&
        (Array.isArray(value) ? isEmpty : isFocused || didEdit) && (
          <ul className='validation-msgs-list'>
            {validationResults?.map((result, index) => (
              // List all the rules and messages
              <li
                key={index}
                className={
                  // assign proper class
                  (Array.isArray(value) ? value.length === 0 : !value)
                    ? 'validation-msgs-list__msg validation-msgs-list__msg--help'
                    : result.valid
                    ? 'validation-msgs-list__msg validation-msgs-list__msg--valid'
                    : 'validation-msgs-list__msg validation-msgs-list__msg--error'
                }
              >
                {/* Assign proper symbol */}
                {
                  <>
                    <span className='material-symbols-rounded'>
                      {isEmpty
                        ? 'help'
                        : result.valid
                        ? 'check_circle'
                        : 'error'}
                    </span>
                    {result.message}
                  </>
                }
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}

export default Input;
