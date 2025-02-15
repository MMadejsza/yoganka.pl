import {Helmet} from 'react-helmet';
import B2BIntroSection from '../components/b2b/B2BIntroSection.jsx';
import CampsBenefitsSection from '../components/camps/CampsBenefitsSection.jsx';
import OfferSection from '../components/OfferSection.jsx';
import CampsReviewsSection from '../components/camps/CampsReviewsSection.jsx';
import CampsGalerySection from '../components/camps/CampsGalerySection.jsx';
import {CAMPS_DATA} from '../DATA/CAMPS_DATA.js';

const products = [{id: 'wyjazdy', header: `Wybierz swój wyjazd`, data: CAMPS_DATA, limit: 0}];
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
			<CampsBenefitsSection />
			<OfferSection products={products} />
			<CampsReviewsSection />
			<CampsGalerySection
				camps={CAMPS_DATA}
				isMobile={true}
			/>
		</>
	);
}

export default B2BPage;
