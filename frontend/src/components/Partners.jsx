import Section from './Section.jsx';
import Carousel from './Carousel.jsx';
import GlideContainer from './glide/GlideContainer.jsx';
import {PARTNERS_DATA} from '../DATA/PARTNERS_DATA.js';

function Partners() {
	const leadingClass = 'partners';
	return (
		<Section
			classy={leadingClass}
			header='Zaufali mi:'>
			{/* <Carousel
				classy={leadingClass}
				items={PARTNERS_DATA}
			/> */}
			<GlideContainer
				glideConfig={{
					type: 'carousel',
					// startAt: 0,
					perView: 5,
					focusAt: 'center',
					gap: 30,
					// autoplay: 2200,
					animationDuration: 800,
				}}
				type='partner'
				slides={PARTNERS_DATA}
				leadingClass={leadingClass}
			/>
		</Section>
	);
}

export default Partners;
