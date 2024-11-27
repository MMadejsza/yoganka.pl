import Section from './Section.jsx';
import Carousel from './Carousel.jsx';
import {PARTNERS_DATA} from '../PARTNERS_DATA.js';

function Partners() {
	const leadingClass = 'partners';
	return (
		<Section
			classy={leadingClass}
			header='Zaufali mi:'>
			<Carousel
				classy={leadingClass}
				items={PARTNERS_DATA}
			/>
		</Section>
	);
}

export default Partners;
