import Section from './Section.jsx';
import StampedImg from './imgsRelated/StampedImg.jsx';
import Bio from './Bio.jsx';
import img320 from '/imgs/about/320_about_profile.jpg';
import img600 from '/imgs/about/600_about_profile.jpg';
import cert320 from '/imgs/about/about_YA-Logo.png';
import cert600 from '/imgs/about/about_ryt.png';
const stampedImgPaths = [
	{path: img320, size: '320w'},
	{path: img600, size: '600w'},
];
const stampedImgCertPaths = [
	{path: cert320, alt: 'Logo federacji yogi'},
	{path: cert600, alt: 'Autoryzowany nauczyciel jogi'},
];

function About() {
	return (
		<Section
			classy='about'
			header='O mnie'>
			<StampedImg
				placement='about'
				imgPaths={stampedImgPaths}
				certPaths={stampedImgCertPaths}
				sizes='(max-width: 640px) 320px,(max-width: 1024px) 600px,320px'
				alt='Yoganka - w pozycji na plaży'
			/>
			<Bio placement='about' />
		</Section>
	);
}

export default About;
