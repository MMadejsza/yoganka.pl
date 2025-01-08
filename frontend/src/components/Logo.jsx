function Logo({placement, media, isActive}) {
	const file = media == 'mobile' ? 'logo_1.svg' : isActive ? 'logo_2_active.png' : 'logo_2.png';
	const path = `imgs/logo/${file}`;

	return (
		<div className={`${placement}__logo-container`}>
			<img
				className={`${placement}__logo`}
				src={path}
				loading='lazy'
				alt='Logo Yoganka'
			/>
		</div>
	);
}

export default Logo;
