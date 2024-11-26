import headerImg320 from '/imgs/logo/320_logo_14.png';
import headerImg480 from '/imgs/logo/480_logo_14.png';

const clPref = 'top-image-header';
// if visited on iOS, remove nor supported backgroundAttachment fixed
let iClass;
if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
	iClass = {backgroundAttachment: 'scroll'};
}

function HeaderMain() {
	return (
		<section
			className={clPref}
			style={iClass}>
			<header className={`${clPref}__header`}>
				<img
					className={`${clPref}__logo`}
					srcSet={`${headerImg320} 320w, ${headerImg480} 480w`}
					sizes='
								(max-width: 320px) 320px,
								480px'
					src={headerImg480}
					loading='lazy'
				/>
			</header>
			<div className={`${clPref}__motto`}>
				<h3>yoga | slow life | mindfulness</h3>
			</div>
		</section>
	);
}

export default HeaderMain;
