function ImgDynamic({className}) {
	return (
		<img
			className={className}
			srcSet={`${headerImg320} 320w, ${headerImg480} 480w`}
			sizes='
                    (max-width: 320px) 320px,
                    480px'
			src={headerImg480}
			loading='lazy'
		/>
	);
}

export default ImgDynamic;
