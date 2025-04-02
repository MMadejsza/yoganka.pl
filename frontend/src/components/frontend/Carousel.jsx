const setsNumber = 2;

function Carousel({ classy, items }) {
  const arrayForSets = Array.from({ length: setsNumber });

  return (
    <div className={`${classy}__gallery-slide`}>
      {arrayForSets.map(articleIndex => (
        <article key={articleIndex} className={`${classy}__gallery`}>
          {items.map((partner, partnerIndex) => (
            <a
              key={partnerIndex}
              href={partner.link}
              target='_blank'
              className={`${classy}__link`}
            >
              <img
                src={partner.logo}
                loading='lazy'
                alt={partner.alt}
                className={`${classy}__image`}
              />
            </a>
          ))}
        </article>
      ))}
    </div>
  );
}

export default Carousel;
