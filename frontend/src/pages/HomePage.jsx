import {Helmet} from 'react-helmet';
import HeaderMain from '../components/HeaderMain.jsx';
import About from '../components/About.jsx';
import OfferSection from '../components/OfferSection.jsx';
import Certificates from '../components/Certificates.jsx';
import Partners from '../components/Partners.jsx';
import {CLASSES_DATA} from '../DATA/CLASSES_DATA.js';
import {CAMPS_DATA} from '../DATA/CAMPS_DATA.js';
import {EVENTS_DATA} from '../DATA/EVENTS_DATA.js';

const products = [
	{
		id: 'wyjazdy',
		header: `Kobiece Wyjazdy z\u00a0Jogą`,
		data: CAMPS_DATA,
		limit: 2,
		moreLink: '/wyjazdy',
	},
	{id: 'zajecia', header: `Zajęcia`, data: CLASSES_DATA},
	{
		id: 'wydarzenia',
		header: `Wydarzenia`,
		data: EVENTS_DATA,
		// moreLink: '/wydarzenia',
		specifier: 'events',
	},
];
function HomePage() {
	const mediaQuery = window.matchMedia('(max-width: 1024px)');
	const isMobile = mediaQuery.matches;
	return (
		<>
			<Helmet>
				<title>Yoganka</title>
				<link
					rel='canonical'
					href='https://yoganka.pl/'
				/>
			</Helmet>
			{isMobile ? <HeaderMain /> : null}
			<About isMobile={isMobile} />
			<OfferSection products={products} />
			<Certificates />
			<Partners />
		</>
	);
}

export default HomePage;
