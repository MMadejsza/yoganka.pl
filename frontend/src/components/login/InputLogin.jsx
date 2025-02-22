function InputLogin({formType, id, label, value, isFocused, didEdit, validationResults, ...props}) {
	return (
		<div className='input-pair'>
			<label htmlFor={id}>{label}</label>
			<input
				id={id}
				value={value}
				{...props}
				className={`${formType}-form__${id}-input`}
			/>

			{/* After editing */}
			{(isFocused || didEdit) && (
				<ul className='control-error'>
					{validationResults.map((result, index) => (
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
							}>
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
