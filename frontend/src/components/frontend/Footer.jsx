import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  footerBusinessDataGroQ,
  footerSocialsGroQ,
  logosGroQ,
} from '../../utils/httpGroq.js';
import { client } from '../../utils/sanityClient.js';
import BusinessDetails from './BusinessDetails.jsx';
import DevDetails from './DevDetails.jsx';
import Logo from './Logo.jsx';
import Socials from './Socials.jsx';

function Footer() {
  const leadingClass = 'footer';

  const cacheConfig = { staleTime: 1000 * 60 * 10, cacheTime: 1000 * 60 * 15 };
  const { data: LOGO_DATA, isLoading: logoLoading } = useQuery({
    queryKey: ['logotypesData'],
    queryFn: () => client.fetch(logosGroQ),
    ...cacheConfig,
  });
  const { data: BUSINESS_DATA, isLoading: businessDataLoading } = useQuery({
    queryKey: ['footerBusinessData'],
    queryFn: () => client.fetch(footerBusinessDataGroQ),
    ...cacheConfig,
  });
  const { data: SOCIALS_DATA, isLoading: socialsDataLoading } = useQuery({
    queryKey: ['socialsData'],
    queryFn: () => client.fetch(footerSocialsGroQ),
    ...cacheConfig,
  });

  if (logoLoading || businessDataLoading || socialsDataLoading) {
    return;
  }

  const dataSets = [LOGO_DATA, BUSINESS_DATA, SOCIALS_DATA];
  const anyEmpty = dataSets.some(data => !data || data.length === 0);
  let content;
  if (!anyEmpty) {
    content = (
      <>
        <Logo type='justBody' data={LOGO_DATA} placement={leadingClass} />
        <BusinessDetails data={BUSINESS_DATA} leadingClass={leadingClass} />
        <Socials leadingClass={leadingClass} items={SOCIALS_DATA} />
      </>
    );
  }

  return (
    <footer>
      <main className={leadingClass}>
        {content}
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
      </main>
    </footer>
  );
}

export default Footer;
