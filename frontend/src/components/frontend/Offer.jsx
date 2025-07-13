import { Link } from 'react-router-dom';
import { campsSort, classesSort, eventsSort } from '../../utils/sorting.js';
import Tile from './Tile.jsx';

function Offer({ id, specifier, header, data, today, limit, moreLink }) {
  // console.log('Offer data', data);

  let classy = 'offer-type';
  const modifier = specifier ? `offer-type--${specifier}` : '';
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
    <article id={id} className={`${classy} ${modifier}`}>
      <header className={`${classy}__header`}>{header}</header>
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
          className={`${classy}__more clickable`}
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

export default Offer;
