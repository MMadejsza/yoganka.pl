function InputLogin({formType, id, label, didEdit, validationResults, ...props}) {
	return (
		<div className='input-pair'>
			<label htmlFor={id}>{label}</label>
			<input
				id={id}
				{...props}
				className={`${formType}-form__${id}-input`}
			/>

			{/* After editing */}
			{didEdit && (
				<div className='control-error'>
					{validationResults.map((result, index) => (
						// List all the rules and messages
						<p
							key={index}
							className={
								// assign proper class
								result.valid ? 'control-error msg-valid' : 'control-error msg-error'
							}>
							{/* Assign proper symbol */}
							{result.valid ? 'OK:' : 'X:'} {result.message}
						</p>
					))}
				</div>
			)}
		</div>
	);
}

export default InputLogin;
