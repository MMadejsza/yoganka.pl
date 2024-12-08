import {useState} from 'react';
import ImgDynamic from './imgsRelated/ImgDynamic.jsx';
import Modal from './Modal.jsx';

function Tile({data, today}) {
	const [visiting, setVisiting] = useState(false);

	const imgPaths = [
		{path: `${data.imgPath}/320_${data.fileName}_0.jpg`, size: '320w'},
		{path: `${data.imgPath}/480_${data.fileName}_0.jpg`, size: '600w'},
	];
	let clickable = data.type !== 'class';
	let conditionalClasses = data.type !== 'class' ? ' tile--clickable' : '';
	if (data.extraClass) {
		conditionalClasses += ` tile--${data.extraClass}`;
	}
	if (data.date < today) {
		conditionalClasses += ` past`;
		// remove the past price
		if (data.modal) {
			data.modal.glance.price = '-';
		}
	}

	function handleModalClick() {
		setVisiting(!visiting);
	}

	const singleImg = (
		<ImgDynamic
			classy={`tile__img`}
			srcSet={imgPaths}
			sizes={`
		(max-width: 640px) 320px,
		(max-width: 768px) 480px,
		480px
		`}
			alt={data.name}
		/>
	);

	return (
		<div
			className={'tile' + conditionalClasses}
			onClick={clickable ? handleModalClick : undefined}>
			{singleImg}

			<h3 className='tile__title'>{data.front.title}</h3>

			{data.front.dates.length > 0 &&
				data.front.dates.map((date, index) => (
					<h3
						className='tile__date'
						key={index}>
						{date}
					</h3>
				))}

			{data.front.location && <h4 className='tile__location'>{data.front.location}</h4>}

			{data.front.desc && <p className='tile__desc'>{data.front.desc}</p>}

			{data.front.btnsContent.length > 0 &&
				data.front.btnsContent.map((btn, index) => (
					<a
						key={index}
						href={btn.link}
						className={`tile__btn tile__btn--${data.fileName}`}>
						{btn.text}
					</a>
				))}

			{visiting && (
				<Modal
					visited={visiting}
					tile={data}
					singleImg={singleImg}
					onClose={handleModalClick}
					today={today}
				/>
			)}
		</div>
	);
}

export default Tile;
