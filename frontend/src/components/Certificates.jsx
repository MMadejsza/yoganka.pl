import Section from './Section.jsx';
import GlideContainer from './GlideContainer.jsx';
import {CERTIFICATES_DATA} from '../DATA/CERTIFICATES_DATA.js';

function Certificates() {
	const leadingClass = 'certificates';
	return (
		<>
			<Section
				classy={leadingClass}
				header='Certyfikaty'>
				<GlideContainer
					type='tile'
					glideConfig={{
						type: 'carousel',
						// startAt: 0,
						perView: 5,
						focusAt: 'center',
						gap: 20,
						autoplay: 2200,
						animationDuration: 800,
					}}
					slides={CERTIFICATES_DATA}
					leadingClass={leadingClass}
				/>
			</Section>
		</>
	);
}

export default Certificates;
