import headerImg320 from '/imgs/logo/320_logo_14.png';
import headerImg480 from '/imgs/logo/480_logo_14.png';

function HeaderMain() {
	return (
		<section className='top-image-header'>
			<header className='top-image-header__header'>
				<img
					className='top-image-header__logo'
					srcSet={`${headerImg320} 320w, ${headerImg480} 480w`}
					sizes='
								(max-width: 320px) 320px,
								480px'
					src={headerImg480}
					loading='lazy'
				/>
			</header>
			<div className='top-image-header__motto'>
				<h3>yoga | slow life | mindfulness</h3>
			</div>
		</section>
	);
}

export default HeaderMain;
