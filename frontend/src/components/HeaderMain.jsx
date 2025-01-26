import Section from './Section.jsx';
import Motto from './HeaderMotto.jsx';
import ImgDynamic from './imgsRelated/ImgDynamic.jsx';
import headerImg320 from '/imgs/logo/320_logo_14.png';
import headerImg480 from '/imgs/logo/480_logo_14.png';
const logoPaths = [
	{path: headerImg320, size: '320w'},
	{path: headerImg480, size: '480w'},
];

const prefix = 'top-image-header';

function HeaderMain() {
	return (
		<>
			<Section
				classy={prefix}
				header={
					<div className='logo-writing__container'>
						<ImgDynamic
							classy={`logo-writing__logo-file`}
							srcSet={logoPaths}
							sizes='(max-width: 320px) 320px,
							480px'
						/>
					</div>
				}
				iSpecific>
				<Motto />
			</Section>
		</>
	);
}

export default HeaderMain;
