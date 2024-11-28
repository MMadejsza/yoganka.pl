import LogoFull from './LogoFull.jsx';
import BusinessDetails from './BusinessDetails.jsx';
import Socials from './Socials.jsx';
import DevDetails from './DevDetails.jsx';
import {SOCIALS_DATA} from '../DATA/SOCIALS_DATA.js';

function Footer() {
	const leadingClass = 'footer';

	return (
		<footer className={leadingClass}>
			<LogoFull placement={leadingClass} />
			<BusinessDetails leadingClass={leadingClass} />
			<Socials
				leadingClass={leadingClass}
				items={SOCIALS_DATA}
			/>
			<DevDetails leadingClass={leadingClass} />
		</footer>
	);
}

export default Footer;
