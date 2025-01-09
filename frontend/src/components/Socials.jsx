function Socials({leadingClass, items}) {
	return (
		<div className={`${leadingClass}__socials`}>
			{items.map((social, index) => (
				<a
					key={social.name}
					className={`${leadingClass}__social-link`}
					href={social.link}
					target='_blank'
					title={social.title}>
					<div className={`${leadingClass}__social`}>
						{/* {social.materialSymbol ? (
							<span
								className={`material-symbols-outlined ${leadingClass}__social-icon ${social.materialSymbol}`}>
								{social.materialSymbol}
							</span>
						) : ( */}
						<i className={`${leadingClass}__social-icon ${social.iconClass}`} />
						{/* )} */}
						<div className={`${leadingClass}__qr`}>
							<img
								className={`${leadingClass}__qr-image`}
								src={social.qr}
								alt={social.qrAlt()}
							/>
						</div>
					</div>
				</a>
			))}
		</div>
	);
}

export default Socials;
