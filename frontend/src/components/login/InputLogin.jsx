function InputLogin({
	formType,
	embedded,
	id,
	label,
	value,
	isFocused,
	didEdit,
	validationResults,
	...props
}) {
	let input;
	if (props.type === 'checkbox') {
		input = (
			<input
				id={id}
				type='checkbox'
				checked={value}
				{...props}
				className={`${formType}-form__${id}-input`}
			/>
		);
	} else {
		input = (
			<input
				id={id}
				value={value}
				{...props}
				className={`${formType}-form__${id}-input`}
			/>
		);
	}
	if (props.type == 'select') {
		input = (
			<select
				name={id}
				id={id}
				value={value}
				{...props}>
				{props.options.map((option) => (
					<option
						key={option.value}
						value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		);
	}
	return (
		<div
			className={`${
				embedded ? 'user-container__section-record modal-checklist__li' : 'input-pair'
			} ${props.type == 'tel' && 'phone'}`}>
			<label
				htmlFor={id}
				className={`${embedded ? 'user-container__section-record-label' : ''}`}>
				{label}
			</label>

			{input}

			{/* After editing */}
			{validationResults && (isFocused || didEdit) && (
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
