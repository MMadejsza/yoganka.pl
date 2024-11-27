function Stamp({placement, paths}) {
	return (
		<div className={`${placement}__certificates`}>
			{paths.map((img) => (
				<img
					key={img.path}
					src={img.path}
					alt={img.alt}
					loading='lazy'
				/>
			))}
		</div>
	);
}

export default Stamp;
