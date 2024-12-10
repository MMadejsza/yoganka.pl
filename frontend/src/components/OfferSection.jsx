import Section from './Section.jsx';
import Offer from './Offer.jsx';
import {CLASSES_DATA} from '../DATA/CLASSES_DATA.js';
import {CAMPS_DATA} from '../DATA/CAMPS_DATA.js';
import {EVENTS_DATA} from '../DATA/EVENTS_DATA.js';

// Get todays date
const todayRaw = new Date();
const today = todayRaw.toISOString().split('T')[0]; // "YYYY-MM-DD"

function OfferSection() {
	const leadingClass = 'offer';
	return (
		<Section classy={leadingClass}>
			<Offer
				id='wyjazdy'
				header={`Kobiece Wyjazdy z\u00a0Jogą`}
				data={CAMPS_DATA.slice(0, 2)}
				today={today}
			/>
			<Offer
				id='zajecia'
				header={`Zajęcia`}
				data={CLASSES_DATA}
				today={today}
			/>
			<Offer
				id='wydarzenia'
				specifier='events'
				header={`Wydarzenia`}
				data={EVENTS_DATA}
				today={today}
			/>
		</Section>
	);
}

export default OfferSection;
