import Tile from './Tile.jsx';
import {Link, useNavigate, useLocation} from 'react-router-dom';

function Offer({id, specifier, header, data, today, limit, moreLink}) {
	let classy = 'offer-type';
	const modifier = specifier ? `offer-type--${specifier}` : null;
	const products = limit ? data.slice(0, limit) : data;

	return (
		<article
			id={id}
			className={`${classy} ${modifier}`}>
			<header className={`${classy}__header`}>{header}</header>
			{products.map((tileData, index) => (
				<Tile
					data={tileData}
					key={index}
					today={today}
				/>
			))}
			{moreLink ? (
				<Link
					className={`${classy}__more clickable`}
					to={moreLink}>
					Zobacz więcej ...
				</Link>
			) : null}
		</article>
	);
}

export default Offer;
