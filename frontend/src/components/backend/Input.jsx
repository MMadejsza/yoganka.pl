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
    input = (
      <input
        id={id}
        {...props}
        type='checkbox'
        checked={value}
        className={inputClass}
      />
    );
  } else if (props.type == 'select') {
    input = (
      <select
        id={id}
        name={id}
        {...props}
        value={value}
        className={selectClass}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
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
            ></label>
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
      {!isLogin && validationResults && (isFocused || didEdit) && (
        <ul className='validation-msgs-list'>
          {validationResults?.map((result, index) => (
            // List all the rules and messages
            <li
              key={index}
              className={
                // assign proper class
                !value
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
                    {!value ? 'help' : result.valid ? 'check_circle' : 'error'}
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
