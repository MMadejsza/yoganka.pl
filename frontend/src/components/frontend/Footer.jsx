import { SOCIALS_DATA } from '../../DATA/SOCIALS_DATA.js';
import BusinessDetails from './BusinessDetails.jsx';
import DevDetails from './DevDetails.jsx';
import Logo from './Logo.jsx';
import Socials from './Socials.jsx';

function Footer() {
  const leadingClass = 'footer';

  return (
    <footer className={leadingClass}>
      <Logo placement={leadingClass} />
      <BusinessDetails leadingClass={leadingClass} />
      <Socials leadingClass={leadingClass} items={SOCIALS_DATA} />
      <DevDetails leadingClass={leadingClass} />
    </footer>
  );
}

export default Footer;
