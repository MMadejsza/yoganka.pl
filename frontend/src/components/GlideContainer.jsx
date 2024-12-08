import React, {useEffect, useRef} from 'react';
import '@glidejs/glide/dist/css/glide.core.min.css';
import '@glidejs/glide/dist/css/glide.theme.min.css';
import Glide from '@glidejs/glide';
import CertificateSlide from './CertificateSlide.jsx';
import PhotoSlide from './PhotoSlide.jsx';

function GlideContainer({glideConfig, glideBreakpoints, slides}) {
	const glideContainer = useRef(null);
	useEffect(() => {
		// double checking if component is rendered
		if (glideContainer.current) {
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
		}
	}, [glideConfig, glideBreakpoints]);

	let photosArr;
	if (slides.type === 'photo') {
		photosArr = Array.from({length: slides.size});
	}

	return (
		<div
			className='glide'
			ref={glideContainer}>
			<div
				className='glide__track'
				data-glide-el='track'>
				<ul className='glide__slides'>
					{slides.type === 'tile'
						? slides.data.map((slide, index) => (
								<CertificateSlide
									key={index}
									slideData={slide}
								/>
						  ))
						: null}
					{slides.type === 'photo'
						? photosArr.map((emptyItem, index) => (
								<PhotoSlide
									key={index}
									photoNo={index}
									slideData={emptyItem}
								/>
						  ))
						: null}
				</ul>
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
