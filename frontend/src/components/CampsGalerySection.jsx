import Section from './Section.jsx';
import GlideContainer from './glide/GlideContainer.jsx';

function CampsGalerySection({camps}) {
	const leadingClass = 'galery';
	return (
		<>
			<Section
				classy={leadingClass}
				header='Jak to wygląda?'>
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
					glideBreakpoints={{
						// <=
						360: {perView: 1},
						480: {perView: 1},
					}}
					type='allPhotos'
					slides={camps}
					leadingClass={leadingClass}
				/>
			</Section>
		</>
	);
}

export default CampsGalerySection;
