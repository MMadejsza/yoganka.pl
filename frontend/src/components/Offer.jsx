import Tile from 'Tile.jsx';

function Offer({id, specifier, header, data}) {
	let classy = 'offer-type';
	if (specifier === 'events') {
		classy += ` offer-type--event`;
	}

	return (
		<article
			id={id}
			className={classy}>
			<header class='offer-type__header'>{header}</header>
		</article>
	);
}

export default Offer;
