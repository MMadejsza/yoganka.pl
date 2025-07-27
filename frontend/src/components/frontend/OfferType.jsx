import { Link } from 'react-router-dom';
import { campsSort, classesSort, eventsSort } from '../../utils/sorting.js';
import Tile from './Tile.jsx';

function OfferType({ id, specifier, header, data, limit, moreLink }) {
  // console.log('OfferType data', data);

  const todayRaw = new Date();
  const today = todayRaw.toISOString().split('T')[0];

  const modifier = specifier ? ` section--${specifier}` : '';

  let sortedData;
  switch (data[0].type) {
    case 'camp':
      sortedData = campsSort(data);
      break;
    case 'event':
      sortedData = eventsSort(data);
      break;
    case 'class':
      sortedData = classesSort(data);
      break;

    default:
      sortedData = data;
  }

  const products = limit ? sortedData.slice(0, limit) : sortedData;
  const nonClickableTypes = ['b2b', 'class'];

  return (
    <article id={id} className={`section${modifier} section--sub`}>
      <header className={`section__header section__header--sub`}>
        {header}
      </header>

      {products.map((tileData, index) => (
        <Tile
          data={tileData}
          key={index}
          today={today}
          clickable={nonClickableTypes.includes(tileData.type) ? false : true}
        />
      ))}

      {moreLink ? (
        <Link
          className={`section__more clickable`}
          onClick={() => {
            window.scrollTo(0, 0);
          }}
          to={moreLink}
        >
          Zobacz więcej ...
        </Link>
      ) : null}
    </article>
  );
}

export default OfferType;
