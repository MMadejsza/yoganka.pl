import Section from './Section.jsx';
import StampedImg from './imgsRelated/StampedImg.jsx';
import Bio from './Bio.jsx';
import ImgDynamic from './imgsRelated/ImgDynamic.jsx';
import logoImg320 from '/imgs/logo/320_logo_14.png';
import logoImg480 from '/imgs/logo/480_logo_14.png';
const logoPaths = [
	{path: logoImg320, size: '320w'},
	{path: logoImg480, size: '480w'},
];
import img320 from '/imgs/about/480_about_profile.jpg';
import img600 from '/imgs/about/768_about_profile.jpg';
import cert320 from '/imgs/about/about_YA-Logo.png';
import cert600 from '/imgs/about/about_ryt.png';
const stampedImgPaths = [
	{path: img320, size: '480w'},
	{path: img600, size: '768w'},
];
const stampedImgCertPaths = [
	{path: cert320, alt: 'Logo federacji yogi'},
	{path: cert600, alt: 'Autoryzowany nauczyciel jogi'},
];
function About({isMobile}) {
	return (
		<Section
			classy='about'
			header='O mnie'>
			{isMobile ? null : (
				<div className='logo-writing__container'>
					<ImgDynamic
						classy={`logo-writing__logo-file`}
						srcSet={logoPaths}
						sizes='(max-width: 320px) 320px,
								480px'
					/>
				</div>
			)}
			<StampedImg
				placement='about'
				imgPaths={stampedImgPaths}
				certPaths={stampedImgCertPaths}
				sizes='(max-width: 640px) 320px,(max-width: 1024px) 600px,320px'
				alt='Yoganka - w pozycji na plaży'
			/>
			<Bio
				placement='about'
				isMobile={isMobile}
			/>
		</Section>
	);
}

export default About;
