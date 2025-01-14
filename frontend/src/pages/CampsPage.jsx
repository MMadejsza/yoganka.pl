import CampsIntoSection from '../components/CampsIntoSection.jsx';
import CampsBenefitsSection from '../components/CampsBenefitsSection.jsx';
import OfferSection from '../components/OfferSection.jsx';
import {CAMPS_DATA} from '../DATA/CAMPS_DATA.js';

const products = [{id: 'wyjazdy', header: `Wybierz swój wyjazd`, data: CAMPS_DATA, limit: 0}];
function CampsPage() {
	return (
		<>
			<CampsIntoSection />
			<CampsBenefitsSection />
			<OfferSection products={products} />
		</>
	);
}

export default CampsPage;
