import CampsIntoSection from '../components/CampsIntoSection.jsx';
import CampsBenefitsSection from '../components/CampsBenefitsSection.jsx';
import OfferSection from '../components/OfferSection.jsx';
import CampsReviewsSection from '../components/CampsReviewsSection.jsx';
import CampsGalerySection from '../components/CampsGalerySection.jsx';
import {CAMPS_DATA} from '../DATA/CAMPS_DATA.js';

const products = [{id: 'wyjazdy', header: `Wybierz swój wyjazd`, data: CAMPS_DATA, limit: 0}];
function CampsPage() {
	return (
		<>
			<CampsIntoSection />
			<CampsBenefitsSection />
			<OfferSection products={products} />
			<CampsReviewsSection />
			<CampsGalerySection camps={CAMPS_DATA} />
			{/* mobile? -> slajder with gallery */}
			{/* desktop? -> section with gallery masonry */}
		</>
	);
}

export default CampsPage;
