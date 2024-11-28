import LogoFull from './LogoFull.jsx';
import BusinessDetails from './BusinessDetails.jsx';
import Socials from './Socials.jsx';
import {SOCIALS_DATA} from '../DATA/SOCIALS_DATA.js';

function Footer() {
	const leadingClass = 'footer';
	const devData = {
		content: `© 2024 Maciej Madejsza`,
		link: 'https://bit.ly/MaciejMadejszaProjects',
		title: "Developer's Contact",
	};

	return (
		<footer className={leadingClass}>
			<LogoFull placement={leadingClass} />
			<BusinessDetails leadingClass={leadingClass} />
			<Socials
				leadingClass={leadingClass}
				items={SOCIALS_DATA}
			/>

			<div className={`${leadingClass}__credit`}>
				<a
					className={`${leadingClass}__credit-link`}
					href={devData.link}
					target='_blank'
					title={devData.title}>
					<div className={`${leadingClass}__credits`}>
						{/* hard spaces */}
						{devData.content.replace(' ', '\u00A0')}
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
