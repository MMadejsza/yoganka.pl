import SymbolOrIcon from '../../common/SymbolOrIcon.jsx';
import Section from '../Section.jsx';

function B2BBenefitsSection({ content }) {
  const classy = 'camps-benefits__';
  const mediaQuery = window.matchMedia('(max-width: 1025px)');
  const isMobile = mediaQuery.matches;
  return (
    <Section
      classy='turning-tiles camps-benefits'
      header={content.sectionTitle}
      iSpecific={true}
    >
      <main className='camps-benefits__bullets-container b2b-types'>
        {content.list.map((benefit, index) => {
          return (
            <div
              className={`${classy}bullet-container types__bullet-container`}
              tabIndex='0'
              key={`${content._id}-${index}`}
            >
              {isMobile && (
                <SymbolOrIcon
                  specifier={'web_traffic'}
                  extraClass={`click-suggestion`}
                />
              )}
              <article key={benefit.title} className={`${classy}bullet`}>
                <aside className={`${classy}symbol-container`}>
                  <SymbolOrIcon
                    specifier={benefit.symbol}
                    extraClass={`${classy}symbol`}
                  />
                </aside>
                <header className={`${classy}bullet-header`}>
                  {benefit.title}
                </header>
                <p className={`${classy}bullet-p`}>{benefit.text}</p>
              </article>
            </div>
          );
        })}
      </main>
    </Section>
  );
}

export default B2BBenefitsSection;
