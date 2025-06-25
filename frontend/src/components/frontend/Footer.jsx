import { Link } from 'react-router-dom';
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
      <Link
        className={`${leadingClass}__legal`}
        onClick={() => {
          window.scrollTo(0, 0);
        }}
        to={`/polityka-firmy/regulamin`}
        title={`Regulamin i Polityka Prywatności`}
      >
        Regulamin i Polityka Prywatności
      </Link>
      <DevDetails leadingClass={leadingClass} />
    </footer>
  );
}

export default Footer;
