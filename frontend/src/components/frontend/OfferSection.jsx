import Offer from './Offer.jsx';
import Section from './Section.jsx';

// Get todays date
const todayRaw = new Date();
const today = todayRaw.toISOString().split('T')[0]; // "YYYY-MM-DD"

function OfferSection({ products, extraClass }) {
  const leadingClass = 'section--offer';
  return (
    <Section classy={`${leadingClass} ${extraClass}`}>
      {products.map(product => (
        <Offer
          key={product.id}
          id={product.id}
          header={product.header}
          data={product.data}
          today={today}
          limit={product.limit}
          specifier={product.specifier}
          moreLink={product.moreLink ? product.moreLink : null}
        />
      ))}
    </Section>
  );
}

export default OfferSection;
