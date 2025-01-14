import Section from './Section.jsx';
import GlideContainer from './glide/GlideContainer.jsx';

const REVIEWS_DATA = [
	{
		img: `path`,
		name: `name`,
		productName: `productName`,
		review: `review`,
	},
	{
		img: `path`,
		name: `name`,
		productName: `productName`,
		review: `review`,
	},
	{
		img: `path`,
		name: `name`,
		productName: `productName`,
		review: `review`,
	},
	{
		img: `path`,
		name: `name`,
		productName: `productName`,
		review: `review`,
	},
];

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
						perView: 5,
						focusAt: 'center',
						gap: 20,
						autoplay: 2200,
						animationDuration: 800,
					}}
					slides={{type: 'review', data: REVIEWS_DATA}}
					leadingClass={leadingClass}
				/>
			</Section>
		</>
	);
}

export default CampsReviewsSection;
