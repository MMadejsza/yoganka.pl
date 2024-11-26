function ImgDynamic({classy, srcSet, ...props}) {
	const stampedType = props.type == 'about' ? '__img--portrait' : '';

	const srcSetProcessed = srcSet.map((item) => `${item.path} ${item.size}`).join(', ');

	return (
		<img
			className={`${classy}${stampedType}`}
			srcSet={srcSetProcessed}
			src={srcSet[0].path}
			{...props}
			loading='lazy'
		/>
	);
}

export default ImgDynamic;
