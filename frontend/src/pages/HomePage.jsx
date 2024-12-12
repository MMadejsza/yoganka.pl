import HeaderMain from '../components/HeaderMain.jsx';
import About from '../components/About.jsx';
import OfferSection from '../components/OfferSection.jsx';
import Certificates from '../components/Certificates.jsx';
import Partners from '../components/Partners.jsx';

function HomePage() {
	return (
		<>
			<HeaderMain />
			<About />
			<OfferSection />
			<Certificates />
			<Partners />
		</>
	);
}

export default HomePage;
