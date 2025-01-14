import Section from './Section.jsx';
import Offer from './Offer.jsx';

// Get todays date
const todayRaw = new Date();
const today = todayRaw.toISOString().split('T')[0]; // "YYYY-MM-DD"

function OfferSection({products}) {
	const leadingClass = 'offer';
	return (
		<Section classy={leadingClass}>
			{products.map((product) => (
				<Offer
					key={product.id}
					id={product.id}
					header={product.header}
					data={product.data}
					today={today}
					limit={product.limit}
					specifier={product.specifier}
				/>
			))}
		</Section>
	);
}

export default OfferSection;
