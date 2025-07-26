import SymbolOrIcon from '../../common/SymbolOrIcon.jsx';
import Section from '../Section.jsx';

function B2BBenefitsSection({ content }) {
  const classy = 'turning-tile';
  const mediaQuery = window.matchMedia('(max-width: 1025px)');
  const isMobile = mediaQuery.matches;
  return (
    <Section
      classy={`section--turning-tiles`}
      header={content.sectionTitle}
      iSpecific={true}
    >
      <main className={`${classy}s__container b2b-types`}>
        {content.list.map((benefit, index) => {
          return (
            <div
              className={`${classy}__container ${classy}__container--wide`}
              tabIndex='0'
              key={`${content._id}-${index}`}
            >
              {isMobile && (
                <SymbolOrIcon
                  specifier={'web_traffic'}
                  extraClass={`click-suggestion`}
                />
              )}
              <article key={benefit.title} className={`${classy}`}>
                <aside className={`${classy}__symbol-container`}>
                  <SymbolOrIcon
                    specifier={benefit.symbol}
                    extraClass={`${classy}__symbol`}
                  />
                </aside>
                <header className={`${classy}__header`}>{benefit.title}</header>
                <p className={`${classy}__p`}>{benefit.text}</p>
              </article>
            </div>
          );
        })}
      </main>
    </Section>
  );
}

export default B2BBenefitsSection;
