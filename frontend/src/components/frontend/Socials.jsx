import { btnsMap } from '../../utils/utils';
import SymbolOrIcon from '../common/SymbolOrIcon';
import SanityImage from '../frontend/imgsRelated/SanityImage';

function Socials({ leadingClass, items }) {
  console.log(items);
  const mediaQuery = window.matchMedia('(max-width: 1024px)');
  const isNotMobile = !mediaQuery.matches;
  return (
    <div className={`${leadingClass}__socials`}>
      {items
        .sort((a, b) => a.order - b.order)
        .map(social => {
          const formattedLink = `${btnsMap[social.name]?.linkPrefix}${
            social.link
          }`;

          return (
            <a
              key={social.name}
              className={`${leadingClass}__social-link`}
              href={formattedLink}
              target='_blank'
              title={btnsMap[social.name].title}
            >
              <div className={`${leadingClass}__social`}>
                <SymbolOrIcon
                  type={btnsMap[social.name].type}
                  specifier={btnsMap[social.name]?.content || ''}
                  extraClass={`${leadingClass}__social-icon`}
                />
                {isNotMobile && (
                  <SanityImage
                    image={social.qrImage}
                    variant='qr' //! dodaj ten wariant
                    className={`${leadingClass}__qr-image`}
                    containerClassName={`${leadingClass}__qr`}
                    alt={btnsMap[social.name]?.qrAlt}
                    title={btnsMap[social.name]?.qrTitle}
                  />
                )}
              </div>
            </a>
          );
        })}
    </div>
  );
}

export default Socials;
