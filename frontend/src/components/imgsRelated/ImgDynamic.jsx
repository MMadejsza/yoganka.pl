function ImgDynamic({classy, srcSet, ...props}) {
	const conditionalClasses = [classy, props.type == 'about' ? '__img--portrait' : ''].join(' ');

	const srcSetString = srcSet.map((item) => `${item.path} ${item.size}`).join(', ');

	return (
		<img
			className={conditionalClasses}
			srcSet={srcSetString}
			src={srcSet[0].path}
			{...props}
			loading='lazy'
		/>
	);
}

export default ImgDynamic;
