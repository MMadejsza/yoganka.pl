import {Helmet} from 'react-helmet';
import {useEffect} from 'react';
import B2BIntroSection from '../components/b2b/B2BIntroSection.jsx';
import B2BOptionsSection from '../components/b2b/B2BBenefitsSection.jsx';
import OfferSection from '../components/OfferSection.jsx';
import Benefits from '../components/b2b/B2BBenefits.jsx';
import PriceList from '../components/b2b/PriceList.jsx';
import {OFFER} from '../DATA/B2B_DATA.js';

const products = [{id: 'b2b_offer', header: `oferta`, data: OFFER, limit: 0}];
function B2BPage() {
	// const mediaQuery = window.matchMedia('(max-width: 1025px)');
	// const isMobile = mediaQuery.matches;
	useEffect(() => {
		const wrapper = document.body.querySelector('.wrapper');
		if (wrapper) {
			wrapper.classList.add('b2b');
		}
		return () => {
			// deleting on unmount
			if (wrapper) {
				wrapper.classList.remove('b2b');
			}
		};
	}, []);

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
			<B2BOptionsSection />
			<OfferSection products={products} />
			<Benefits />
			<PriceList />
		</>
	);
}

export default B2BPage;
