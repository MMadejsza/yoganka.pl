function InputLogin({
  formType,
  embedded,
  id,
  label,
  value,
  isFocused,
  didEdit,
  validationResults,
  isLogin,
  ...props
}) {
  let input;
  if (props.type === 'checkbox') {
    input = (
      <input
        id={id}
        {...props}
        type='checkbox'
        checked={value}
        className={`${formType}-form__${id}-input`}
      />
    );
  } else if (props.type == 'select') {
    input = (
      <select id={id} name={id} {...props} value={value}>
        {props.options.map((option, index) => (
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
        className={`${formType}-form__${id}-textarea`}
      ></textarea>
    );
  } else {
    input = (
      <input
        id={id}
        {...props}
        value={value}
        className={`${formType}-form__${id}-input`}
      />
    );
  }

  return (
    <div
      className={`${
        embedded
          ? 'user-container__section-record modal-checklist__li'
          : 'input-pair'
      } ${props.type == 'tel' ? 'phone' : ''}`}
    >
      <label
        htmlFor={id}
        className={`${embedded ? 'user-container__section-record-label' : ''}`}
      >
        {label}
      </label>

      {input}

      {/* After editing */}
      {!isLogin && validationResults && (isFocused || didEdit) && (
        <ul className='control-error'>
          {validationResults?.map((result, index) => (
            // List all the rules and messages
            <li
              key={index}
              className={
                // assign proper class
                !value
                  ? 'control-error__msg msg-help'
                  : result.valid
                    ? 'control-error__msg msg-valid'
                    : 'control-error__msg msg-error'
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

export default InputLogin;
