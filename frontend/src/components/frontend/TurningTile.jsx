import { protectWordBreaks } from '../../utils/validation.js';

function TurningTile({ content, tilesModifier }) {
  const classy = 'turning-tile';

  const mediaQuery = window.matchMedia('(max-width: 1025px)');
  const isMobile = mediaQuery.matches;

  return (
    <div
      className={`${classy}__container${
        tilesModifier ? ` ${classy}__container--${tilesModifier}` : ''
      }`}
      tabIndex='0'
    >
      {isMobile && (
        <span className='material-symbols-rounded click-suggestion'>
          web_traffic
        </span>
      )}
      <article key={content.title} className={`${classy}`}>
        <aside className={`${classy}__symbol-container`}>
          <span className={`material-symbols-rounded ${classy}__symbol`}>
            {content.symbol}
          </span>
        </aside>
        <header className={`${classy}__header`}>
          {protectWordBreaks(content.title)}
        </header>
        <p className={`${classy}__p`}>{protectWordBreaks(content.text)}</p>
      </article>
    </div>
  );
}

export default TurningTile;
