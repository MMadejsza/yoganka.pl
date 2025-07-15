import Section from '../../frontend/Section.jsx';

function CampsBenefitsSection({ data }) {
  const classy = 'camps-benefits__';
  const mediaQuery = window.matchMedia('(max-width: 1025px)');
  const isMobile = mediaQuery.matches;
  return (
    <Section classy='camps-benefits' header={data[0].sectionTitle}>
      <main className='camps-benefits__bullets-container'>
        {data[0].list.map((benefit, index) => {
          return (
            <div
              className={`${classy}bullet-container`}
              tabIndex='0'
              key={index}
            >
              {isMobile && (
                <span className='material-symbols-rounded click-suggestion'>
                  web_traffic
                </span>
              )}
              <article key={benefit.title} className={`${classy}bullet`}>
                <aside className={`${classy}symbol-container`}>
                  <span className={`material-symbols-rounded ${classy}symbol`}>
                    {benefit.symbol}
                  </span>
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

export default CampsBenefitsSection;
