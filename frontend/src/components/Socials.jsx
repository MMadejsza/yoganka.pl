function Socials({leadingClass, items}) {
	const mediaQuery = window.matchMedia('(max-width: 1024px)');
	const isNotMobile = !mediaQuery.matches;
	return (
		<div className={`${leadingClass}__socials`}>
			{items.map((social) => (
				<a
					key={social.name}
					className={`${leadingClass}__social-link`}
					href={social.link}
					target='_blank'
					title={social.title}>
					<div className={`${leadingClass}__social`}>
						{/* {social.materialSymbol ? (
							<span
								className={`material-symbols-rounded ${leadingClass}__social-icon ${social.materialSymbol}`}>
								{social.materialSymbol}
							</span>
						) : ( */}
						<i className={`${leadingClass}__social-icon ${social.iconClass}`} />
						{/* )} */}
						{isNotMobile && (
							<div className={`${leadingClass}__qr`}>
								<img
									className={`${leadingClass}__qr-image`}
									src={isNotMobile ? social.qr : ''}
									alt={social.qrAlt()}
								/>
							</div>
						)}
					</div>
				</a>
			))}
		</div>
	);
}

export default Socials;
