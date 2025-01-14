import Section from './Section.jsx';
import GlideContainer from './glide/GlideContainer.jsx';

const REVIEWS_DATA = [
	{
		img: 'https://thispersondoesnotexist.com/?gender=male&age=30&ethnicity=white',
		name: 'Jan Kowalski',
		productName: 'Camp Harmonia',
		review: 'Świetny ośrodek, idealne miejsce na relaks i wypoczynek z rodziną.',
	},
	{
		img: 'https://thispersondoesnotexist.com/?gender=female&age=25&ethnicity=white',
		name: 'Anna Nowak',
		productName: 'Kaszuby Camping',
		review: 'Piękne miejsce z cudownymi widokami. Idealne dla osób szukających ciszy i spokoju.',
	},
	{
		img: 'https://thispersondoesnotexist.com/?gender=male&age=40&ethnicity=white',
		name: 'Piotr Wiśniewski',
		productName: 'Warmia Resort',
		review: 'Bardzo komfortowe warunki, profesjonalna obsługa. Polecam na każdą okazję!',
	},
	{
		img: 'https://thispersondoesnotexist.com/?gender=female&age=35&ethnicity=white',
		name: 'Katarzyna Wójcik',
		productName: 'Mazury Camp',
		review: 'Rewelacyjne miejsce nad jeziorem. Idealne do aktywnego wypoczynku na świeżym powietrzu.',
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
