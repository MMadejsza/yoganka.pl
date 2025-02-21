function LoginFrom({type, regQuestion}) {
	return (
		<section className={type}>
			{type == 'register' && regQuestion && (
				<article className='register__question-block'>
					<label htmlFor='register-question'>Zarejestruj mnie</label>
					<input
						type='checkbox'
						name='register-question'
						id='register-question-input'
					/>
				</article>
			)}

			<form
				action=''
				className={`${type}-form`}>
				<h1>Zaloguj się</h1>
				<label htmlFor={`${type}-login`}>Login</label>
				<input
					type='text'
					placeholder='Unikatowy login'
					name={`${type}-login`}
					className={`${type}-form__login-input`}
				/>
				<label htmlFor={`${type}-password`}>Hasło</label>
				<input
					type='password'
					name={`${type}-password`}
					className={`${type}-form__password-input`}
				/>
				<label htmlFor={`${type}-mail`}>E-mail</label>
				<input
					type='mail'
					placeholder='Mail do autoryzacji'
					name={`${type}-mail`}
					className={`${type}-form__mail-input`}
				/>
			</form>
		</section>
	);
}

export default LoginFrom;
