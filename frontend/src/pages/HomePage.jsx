import HeaderMain from '../components/HeaderMain.jsx';
import About from '../components/About.jsx';
import OfferSection from '../components/OfferSection.jsx';
import Certificates from '../components/Certificates.jsx';
import Partners from '../components/Partners.jsx';

function HomePage() {
	const mediaQuery = window.matchMedia('(max-width: 1024px)');
	const isMobile = mediaQuery.matches;
	return (
		<>
			{isMobile ? <HeaderMain /> : null}
			<About isMobile={isMobile} />
			<OfferSection />
			<Certificates />
			<Partners />
		</>
	);
}

export default HomePage;
