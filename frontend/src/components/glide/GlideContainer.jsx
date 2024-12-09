import React, {useEffect, useRef} from 'react';
import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.min.css';
import '@glidejs/glide/dist/css/glide.theme.min.css';
import CertificateSlide from './CertificateSlide.jsx';
import PhotoSlide from './PhotoSlide.jsx';

function GlideContainer({placement, glideConfig, glideBreakpoints, slides}) {
	const glideRef = useRef(null);

	useEffect(() => {
		// double checking if component is rendered
		if (glideRef.current) {
			try {
				const glide = new Glide(glideRef.current, {
					...glideConfig,
					breakpoints: glideBreakpoints || {
						360: {perView: 1},
						480: {perView: 2},
						1024: {perView: 3},
					},
				});
				glide.mount();

				// happens after unmounting the component:
				return () => {
					glide.destroy();
				};
			} catch (error) {
				console.error('Error initializing Glide:', error);
			}
		}
	}, [glideConfig, glideBreakpoints]);

	const isTile = slides.type === 'tile';
	const isPhoto = slides.type === 'photo';

	const renderSlides = () => {
		const SlideComponent = isTile ? CertificateSlide : isPhoto ? PhotoSlide : null;
		if (isTile) {
			return slides.data.map((slide, index) => (
				<SlideComponent
					key={index}
					slideData={slide}
				/>
			));
		} else if (isPhoto) {
			return Array.from({length: slides.size}).map((_, index) => (
				<SlideComponent
					key={index}
					photoNo={index + 1}
					slideData={slides}
				/>
			));
		}
	};
	const renderBullets = () => {
		const bulletsCount = isTile ? slides.data.length : isPhoto ? slides.size : 0;

		return Array.from({length: bulletsCount}).map((_, index) => (
			<button
				key={index}
				className='glide__bullet'
				data-glide-dir={`=${index}`}
			/>
		));
	};
	return (
		<div
			className={`glide ${placement ? `glide--${placement}` : ''}`}
			ref={glideRef}>
			<div
				className='glide__track'
				data-glide-el='track'>
				<ul className='glide__slides'>{renderSlides()}</ul>
			</div>

			<div
				className='glide__bullets'
				data-glide-el='controls[nav]'>
				{renderBullets()}
			</div>

			<div
				className='glide__arrows'
				data-glide-el='controls'>
				<button
					className='glide__arrow glide__arrow--left'
					data-glide-dir='<'>
					<i className='fa-solid fa-chevron-left'></i>
				</button>
				<button
					className='glide__arrow glide__arrow--right'
					data-glide-dir='>'>
					<i className='fa-solid fa-chevron-right'></i>
				</button>
			</div>
		</div>
	);
}

export default GlideContainer;
