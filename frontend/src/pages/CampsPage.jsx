import {Helmet} from 'react-helmet';
import CampsIntoSection from '../components/camps/CampsIntoSection.jsx';
import CampsBenefitsSection from '../components/camps/CampsBenefitsSection.jsx';
import OfferSection from '../components/OfferSection.jsx';
import CampsReviewsSection from '../components/camps/CampsReviewsSection.jsx';
import CampsGalerySection from '../components/camps/CampsGalerySection.jsx';
import {CAMPS_DATA} from '../DATA/CAMPS_DATA.js';

const products = [{id: 'wyjazdy', header: `Wybierz swój wyjazd`, data: CAMPS_DATA, limit: 0}];
function CampsPage() {
	// const mediaQuery = window.matchMedia('(max-width: 1025px)');
	// const isMobile = mediaQuery.matches;
	return (
		<>
			<Helmet>
				<title>Yoganka - Wyjazdy</title>
				<link
					rel='canonical'
					href='https://yoganka.pl/wyjazdy'
				/>
			</Helmet>
			<CampsIntoSection />
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

export default CampsPage;
