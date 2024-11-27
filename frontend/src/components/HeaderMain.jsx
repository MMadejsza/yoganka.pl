import Section from './Section.jsx';
import ImgDynamic from './imgs/ImgDynamic.jsx';
import headerImg320 from '/imgs/logo/320_logo_14.png';
import headerImg480 from '/imgs/logo/480_logo_14.png';
const imgPaths = [
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
					<ImgDynamic
						classy={`${prefix}__logo`}
						srcSet={imgPaths}
						sizes='(max-width: 320px) 320px,
							480px'
					/>
				}
				iSpecific>
				<div className={`${prefix}__motto`}>
					<h3>yoga | slow life | mindfulness</h3>
				</div>
			</Section>
		</>
	);
}

export default HeaderMain;
