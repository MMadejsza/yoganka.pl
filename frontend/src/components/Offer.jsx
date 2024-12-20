import Tile from './Tile.jsx';

function Offer({id, specifier, header, data, today}) {
	let classy = 'offer-type';
	if (specifier === 'events') {
		classy += ` offer-type--events`;
	}

	return (
		<article
			id={id}
			className={classy}>
			<header className='offer-type__header'>{header}</header>
			{data.map((tileData, index) => (
				<Tile
					data={tileData}
					key={index}
					today={today}
				/>
			))}
		</article>
	);
}

export default Offer;
