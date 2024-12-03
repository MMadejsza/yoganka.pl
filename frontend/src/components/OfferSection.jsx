import Section from './Section.jsx';
import Offer from './Offer.jsx';

function OfferSection() {
	const leadingClass = 'offer';
	return (
		<Section classy={leadingClass}>
			<Offer
				id='wyjazdy'
				header={`Kobiece Wyjazdy z\u00a0Jogą`}
				data={[]}
			/>
			<Offer
				id='zajecia'
				header={`Zajęcia`}
				data={[]}
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
