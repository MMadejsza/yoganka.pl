function LogoFull({placement}) {
	return (
		<div className={`${placement}__logo-container`}>
			<img
				className={`${placement}__logo`}
				src='imgs/logo/logo_1.svg'
				loading='lazy'
			/>
		</div>
	);
}

export default LogoFull;
