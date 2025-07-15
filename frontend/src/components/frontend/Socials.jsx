import SymbolOrIcon from '../common/SymbolOrIcon';
import SanityImage from '../frontend/imgsRelated/SanityImage';

const iconMap = {
  instagram: { type: 'ICON', content: 'fa-brands fa-instagram' },
  facebook: { type: 'ICON', content: 'fa-brands fa-square-facebook' },
  whatsapp: { type: 'ICON', content: 'fab fa-whatsapp' },
  phone: { type: 'ICON', content: 'fa-solid fa-phone' },
  email: { type: 'ICON', content: 'fa-solid fa-envelope' },
};

function Socials({ leadingClass, items }) {
  console.log(items);
  const mediaQuery = window.matchMedia('(max-width: 1024px)');
  const isNotMobile = !mediaQuery.matches;
  return (
    <div className={`${leadingClass}__socials`}>
      {items
        .sort((a, b) => a.order - b.order)
        .map(social => (
          <a
            key={social.name}
            className={`${leadingClass}__social-link`}
            href={social.link}
            target='_blank'
            title={social.title}
          >
            <div className={`${leadingClass}__social`}>
              <SymbolOrIcon
                specifier={iconMap[social.name].content || ''}
                type={iconMap[social.name].type}
                extraClass={`${leadingClass}__social-icon`}
              />
              {isNotMobile && (
                <SanityImage
                  image={social.qrImage}
                  variant='qr' //! dodaj ten wariant
                  className={`${leadingClass}__qr-image`}
                  containerClassName={`${leadingClass}__qr`}
                  alt={social.qrAlt}
                />
              )}
            </div>
          </a>
        ))}
    </div>
  );
}

export default Socials;
