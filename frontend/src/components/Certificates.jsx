import Section from './Section.jsx';
import '@glidejs/glide/dist/css/glide.core.min.css';
import '@glidejs/glide/dist/css/glide.theme.min.css';
import Glide from '@glidejs/glide';

const glide = new Glide('.glide', {
	type: 'carousel',
	// startAt: 0,
	perView: 5,
	focusAt: 'center',
	gap: 20,
	autoplay: 2200,
	animationDuration: 800,
	breakpoints: {
		// <=
		360: {
			perView: 1,
		},
		480: {
			perView: 2,
		},
		1024: {
			perView: 3,
		},
	},
});
function Certificates() {
	glide.mount();
	return (
		<>
			<Section
				classy='certificates'
				header='Certyfikaty'>
				<div className='glide'>
					<div
						className='glide__track'
						data-glide-el='track'>
						<ul className='glide__slides'>
							<li className='glide__slide'>
								<div className='certificates__tile tile'>
									<h3>
										<strong className='certificates__name'>RYT200 Bali</strong>
									</h3>
									<p className='certificates__school'>House of OM</p>
									<p className='certificates__duration'>200h</p>
									<p className='certificates__type'>
										<strong>Vinyasa &amp; Hatha</strong>
									</p>
								</div>
							</li>
							<li className='glide__slide'>
								<div className='tile certificates__tile'>
									<h3>
										<strong className='certificates__name'>
											Instruktor Hatha Jogi
										</strong>
									</h3>
									<p className='certificates__school'>prof. Szopa</p>
									<p className='certificates__duration'>150h</p>
									<p className='certificates__type'>
										<strong>Hatha</strong>
									</p>
								</div>
							</li>
							<li className='glide__slide'>
								<div className='tile certificates__tile'>
									<h3>
										<strong className='certificates__name'>
											Warsztat sekwencji
										</strong>
									</h3>
									<p className='certificates__school'>Daga Yoga</p>
									<p className='certificates__duration'>15h</p>
								</div>
							</li>
							<li className='glide__slide'>
								<div className='tile certificates__tile'>
									<h3>
										<strong className='certificates__name'>
											Asana stabilna i wygodna
										</strong>
									</h3>
									<p className='certificates__school'>SMU YOGA</p>
									<p className='certificates__duration'>15h</p>
								</div>
							</li>
							<li className='glide__slide'>
								<div className='tile certificates__tile'>
									<h3>
										<strong className='certificates__name'>
											Mobility &amp; Flexibility
										</strong>
									</h3>
									<p className='certificates__school'>Bartosz Kuc</p>
									<p className='certificates__duration'>16h</p>
								</div>
							</li>

							<li className='glide__slide'>
								<div className='tile certificates__tile'>
									<h3>
										<strong className='certificates__name'>Neuro Yoga</strong>
									</h3>
									<p className='certificates__school'>Celest Pereira</p>
									<p className='certificates__duration'>15h</p>
								</div>
							</li>
							<li className='glide__slide'>
								<div className='tile certificates__tile'>
									<h3>
										<strong className='certificates__name'>
											Warsztat pozycji odwróconych
										</strong>
									</h3>
									<p className='certificates__school'>Joga Park</p>
									<p className='certificates__duration'>15h</p>
								</div>
							</li>
						</ul>
					</div>
					<div
						className='glide__bullets'
						data-glide-el='controls[nav]'>
						<button
							className='glide__bullet'
							data-glide-dir='=0'></button>
						<button
							className='glide__bullet'
							data-glide-dir='=1'></button>
						<button
							className='glide__bullet'
							data-glide-dir='=2'></button>
						<button
							className='glide__bullet'
							data-glide-dir='=3'></button>
						<button
							className='glide__bullet'
							data-glide-dir='=4'></button>
						<button
							className='glide__bullet'
							data-glide-dir='=5'></button>
						<button
							className='glide__bullet'
							data-glide-dir='=6'></button>
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
			</Section>
		</>
	);
}

export default Certificates;
