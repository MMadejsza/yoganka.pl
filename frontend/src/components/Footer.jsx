import LogoFull from './LogoFull.jsx';
import BusinessDetails from './BusinessDetails.jsx';
const socials = [];

function Footer() {
	return (
		<footer className='footer'>
			<LogoFull placement='footer' />
			<BusinessDetails leadingClass='footer' />

			<div
				className='footer__socials'
				id='footer__socials'>
				<a
					className='footer__social-link footer__social-link--instagram'
					href='https://www.instagram.com/yoganka_bodyhealing/'
					target='_blank'
					title='Instagram Fanpage'>
					<div className='footer__social'>
						<i className='footer__social-icon fa-brands fa-instagram'></i>
						<div className='footer__qr'>
							<img
								className='footer__qr-image'
								src='imgs/qrs/qrinsta.png'
								alt='Instagram QR Code'
							/>
						</div>
					</div>
				</a>

				<a
					className='footer__social-link footer__social-link--facebook'
					href='https://www.facebook.com/profile.php?id=100094192084948'
					target='_blank'
					title='Facebook Fanpage'>
					<div className='footer__social'>
						<i className='footer__social-icon fa-brands fa-square-facebook'></i>
						<div className='footer__qr'>
							<img
								className='footer__qr-image'
								src='imgs/qrs/qrfb.png'
								alt='Facebook QR Code'
							/>
						</div>
					</div>
				</a>

				<a
					className='footer__social-link footer__social-link--phone'
					href='tel:+48792891607'
					id='phone-contact'
					target='_blank'
					title='Zadzwoń'>
					<div className='footer__social'>
						<i className='footer__social-icon fa-solid fa-phone'></i>
						<div className='footer__qr'>
							<img
								className='footer__qr-image'
								src='imgs/qrs/qrphone.png'
								alt='Phone QR Code'
							/>
						</div>
					</div>
				</a>
				<a
					className='footer__social-link footer__social-link--mail'
					href='mailto:kontakt@yoganka.pl?&body=Hej! Piszę do Ciebie z yoganka.pl'
					id='mail-contact'
					target='_blank'
					title='Wyślij maila'>
					<div className='footer__social'>
						<i className='footer__social-icon fa-solid fa-envelope'></i>
						<div className='footer__qr'>
							<img
								className='footer__qr-image'
								src='imgs/qrs/qrmail.png'
								alt='Mail QR Code'
							/>
						</div>
					</div>
				</a>
				<a
					className='footer__social-link footer__social-link--whatsapp'
					href='#'
					id='whatsapp-contact'
					target='_blank'
					title='Napisz!'>
					<div className='footer__social'>
						<i className='footer__social-icon fab fa-whatsapp'></i>
						<div className='footer__qr'>
							<img
								className='footer__qr-image'
								src='imgs/qrs/qrwa.png'
								alt='WhatsApp QR Code'
							/>
						</div>
					</div>
				</a>
			</div>

			<div className='footer__credit'>
				<a
					className='footer__credit-link'
					href='https://bit.ly/MaciejMadejszaProjects'
					target='_blank'
					title="Developer's Contact">
					<div className='footer__credits'>
						&copy;&nbsp;2024&nbsp;Maciej&nbsp;Madejsza
					</div>
				</a>
			</div>

			<div
				className='footer__pop-ups'
				tabindex='0'>
				<a
					className='footer__pop-up-btn footer__pop-up-btn--gift ml-onclick-form'
					href='javascript:void(0)'
					onclick="ml('show', 'jiW5Nb', true)">
					<i className='footer__pop-up-icon fas fa-gift'></i>
				</a>

				<a
					className='footer__pop-up-btn footer__pop-up-btn--cookies'
					href='#'>
					<i className='footer__pop-up-icon fas fa-cookie-bite'></i>
					<div className='footer__cookie-pop-up clickable'>
						<div className='footer__cookie-msg'>
							Używamy tylko niezbędnych plików cookie.
						</div>
						<div className='footer__cookie-close'>
							<i className='fas fa-times footer__cookie-close-icon'></i>
						</div>
					</div>
				</a>
			</div>
		</footer>
	);
}

export default Footer;
