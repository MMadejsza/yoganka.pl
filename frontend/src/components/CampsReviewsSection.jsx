import Section from './Section.jsx';
import GlideContainer from './glide/GlideContainer.jsx';
import {REVIEWS_DATA} from '../DATA/REVIEWS_DATA.js';

function CampsReviewsSection() {
	const leadingClass = 'reviews';
	return (
		<>
			<Section
				classy={leadingClass}
				header='Opinie uczestników'>
				<GlideContainer
					glideConfig={{
						type: 'carousel',
						// startAt: 0,
						perView: 2,
						focusAt: 'center',
						gap: 20,
						autoplay: 2200,
						animationDuration: 800,
					}}
					glideBreakpoints={{
						// <=
						360: {perView: 1},
						480: {perView: 1},
						1024: {perView: 1},
					}}
					type='review'
					slides={REVIEWS_DATA}
					leadingClass={leadingClass}
				/>
			</Section>
		</>
	);
}

export default CampsReviewsSection;
