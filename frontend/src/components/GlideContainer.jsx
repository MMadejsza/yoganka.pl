import React, {useEffect, useRef} from 'react';
import '@glidejs/glide/dist/css/glide.core.min.css';
import '@glidejs/glide/dist/css/glide.theme.min.css';
import Glide from '@glidejs/glide';
import CertificateSlide from './CertificateSlide.jsx';
import PhotoSlide from './PhotoSlide.jsx';

function GlideContainer({placement, glideConfig, glideBreakpoints, slides}) {
	const glideContainer = useRef(null);
	useEffect(() => {
		// double checking if component is rendered
		if (glideContainer.current) {
			try {
				const glide = new Glide(glideContainer.current, {
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
	}, [glideConfig, glideBreakpoints, slides]);

	let photosArr;
	if (slides.type === 'photo') {
		photosArr = Array.from({length: slides.size});
	}
	const renderProperSlideType = () => {
		if (slides.type === 'tile') {
			return slides.data.map((slide, index) => (
				<CertificateSlide
					key={index}
					slideData={slide}
				/>
			));
		} else if (slides.type === 'photo') {
			return photosArr.map((emptyItem, index) => (
				<PhotoSlide
					key={index}
					photoNo={index + 1}
					slideData={slides}
				/>
			));
		}
	};

	return (
		<div
			className={`glide ${placement ? 'glide--comp' : ''}`}
			ref={glideContainer}>
			<div
				className='glide__track'
				data-glide-el='track'>
				<ul className='glide__slides'>{renderProperSlideType()}</ul>
			</div>

			<div
				className='glide__bullets'
				data-glide-el='controls[nav]'>
				{slides.type === 'tile'
					? slides.data.map((slide, index) => (
							<button
								key={index}
								className='glide__bullet'
								data-glide-dir={`=${index}`}
							/>
					  ))
					: null}
				{slides.type === 'photo'
					? photosArr.map((photo, index) => (
							<button
								key={index}
								className='glide__bullet'
								data-glide-dir={`=${index}`}
							/>
					  ))
					: null}
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