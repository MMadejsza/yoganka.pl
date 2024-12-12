import Burger from '../components/nav/Burger.jsx';
import Nav from '../components/nav/Nav.jsx';
import HeaderMain from '../components/HeaderMain.jsx';
import About from '../components/About.jsx';
import OfferSection from '../components/OfferSection.jsx';
import Certificates from '../components/Certificates.jsx';
import Partners from '../components/Partners.jsx';
import Footer from '../components/Footer.jsx';
import FloatingPopUps from '../components/FloatingPopUps.jsx';

function HomePage() {
	return (
		<>
			<Burger />
			<Nav />
			<HeaderMain />
			<About />
			<OfferSection />
			<Certificates />
			<Partners />
			<Footer />
			<FloatingPopUps />
		</>
	);
}

export default HomePage;
