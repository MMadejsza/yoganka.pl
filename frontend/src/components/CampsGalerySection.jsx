import Section from './Section.jsx';
import GlideContainer from './glide/GlideContainer.jsx';

function CampsGalerySection({camps, isMobile}) {
	const leadingClass = 'galery';
	return (
		<>
			<Section
				classy={leadingClass}
				header='Jak to wygląda?'>
				{isMobile ? (
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
							// 360: {perView: 1},
							// 480: {perView: 1},
							1024: {perView: 1},
						}}
						type='allPhotos'
						slides={camps}
						leadingClass={leadingClass}
					/>
				) : (
					<main>Galeria</main>
				)}
			</Section>
		</>
	);
}

export default CampsGalerySection;
