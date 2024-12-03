import Section from './Section.jsx';
import Offer from './Offer.jsx';
import {CLASSES_DATA} from '../DATA/CLASSES_DATA.js';
import {CAMPS_DATA} from '../DATA/CAMPS_DATA.js';

function OfferSection() {
	const leadingClass = 'offer';
	return (
		<Section classy={leadingClass}>
			<Offer
				id='wyjazdy'
				header={`Kobiece Wyjazdy z\u00a0Jogą`}
				data={CAMPS_DATA}
			/>
			<Offer
				id='zajecia'
				header={`Zajęcia`}
				data={CLASSES_DATA}
			/>
			<Offer
				id='wydarzenia'
				specifier='events'
				header={`Wydarzenia`}
				data={[]}
			/>
		</Section>
	);
}

export default OfferSection;
