import Stamp from './Stamp.jsx';

function StampedImg({placement, imgPaths, certPaths, ...props}) {
	const srcSetProcessed = imgPaths.map((item) => `${item.path} ${item.size}`).join(', ');

	return (
		<aside className={`${placement}__img-container`}>
			<img
				className={`${placement}__img--portrait`}
				srcSet={srcSetProcessed}
				src={imgPaths[0].path}
				loading='lazy'
				{...props}
			/>
			<Stamp
				placement='about'
				paths={certPaths}
			/>
		</aside>
	);
}

export default StampedImg;
