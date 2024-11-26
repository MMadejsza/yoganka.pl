import ImgDynamic from './imgs/ImgDynamic.jsx';
import headerImg320 from '/imgs/logo/320_logo_14.png';
import headerImg480 from '/imgs/logo/480_logo_14.png';
const imgPaths = [
	{path: headerImg320, size: '320w'},
	{path: headerImg480, size: '480w'},
];

// if visited on iOS, remove nor supported backgroundAttachment fixed
let iClass;
if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
	iClass = {backgroundAttachment: 'scroll'};
}
const prefix = 'top-image-header';

function HeaderMain() {
	return (
		<section
			className={prefix}
			style={iClass}>
			<header className={`${prefix}__header`}>
				<ImgDynamic
					classy={`${prefix}__logo`}
					srcSet={imgPaths}
					sizes='(max-width: 320px) 320px,
							480px'
				/>
			</header>
			<div className={`${prefix}__motto`}>
				<h3>yoga | slow life | mindfulness</h3>
			</div>
		</section>
	);
}

export default HeaderMain;
