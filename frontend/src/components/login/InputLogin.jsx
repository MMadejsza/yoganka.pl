function InputLogin({formType, id, label, error, ...props}) {
	return (
		<div className='input-pair'>
			<label htmlFor={id}>{label}</label>
			<input
				id={id}
				{...props}
				className={`${formType}-form__${id}-input`}
			/>
			<div className='control-error control-error--email'>{error && <p>{error}</p>}</div>
		</div>
	);
}

export default InputLogin;
