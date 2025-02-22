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
							{
								<>
									<span className='material-symbols-rounded'>
										{!value ? 'help' : result.valid ? 'check_circle' : 'error'}
									</span>
									{result.message}
								</>
							}
						</p>
					))}
				</div>
			)}
		</div>
	);
}

export default InputLogin;
