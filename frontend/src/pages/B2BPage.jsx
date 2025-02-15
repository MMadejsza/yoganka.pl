import {Helmet} from 'react-helmet';
import B2BIntroSection from '../components/b2b/B2BIntroSection.jsx';
import B2BBenefitsSection from '../components/b2b/B2BBenefitsSection.jsx';
import OfferSection from '../components/OfferSection.jsx';
import {OFFER} from '../DATA/B2B_DATA.js';

const products = [{id: 'b2b_offer', header: `oferta`, data: OFFER, limit: 0}];
function B2BPage() {
	// const mediaQuery = window.matchMedia('(max-width: 1025px)');
	// const isMobile = mediaQuery.matches;
	return (
		<>
			<Helmet>
				<title>Yoga Dla Firm</title>
				<link
					rel='canonical'
					href='https://yoganka.pl/yoga-dla-firm'
				/>
			</Helmet>
			<B2BIntroSection />
			<B2BBenefitsSection />
			<OfferSection products={products} />
		</>
	);
}

export default B2BPage;
