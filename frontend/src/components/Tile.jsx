import {useState, useRef} from 'react';
import ImgDynamic from './imgsRelated/ImgDynamic.jsx';
import Modal from './Modal.jsx';

function Tile({data, today}) {
	const modal = useRef();
	const clickable = data.type !== 'class';
	const isPast = data.date < today;
	const [isModalOpen, setIsModalOpen] = useState(false);

	const conditionalClasses = [
		'tile',
		clickable ? 'tile--clickable' : '',
		isPast ? 'past' : '',
		data.extraClass ? `tile--${data.extraClass}` : '',
	].join(' ');

	const toggleModal = () => {
		// console.log(`toggleModal()`);
		setIsModalOpen(!isModalOpen);
		modal.current.showModal();
	};

	// archive
	if (isPast) data.modal.glance.price = '-';

	const imgPaths = [
		{path: `${data.imgPath}/320_${data.fileName}_0.jpg`, size: '320w'},
		{path: `${data.imgPath}/480_${data.fileName}_0.jpg`, size: '600w'},
	];
	const renderSingleImg = (
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
	const renderDates = data.front.dates.map((date, index) => (
		<h3
			className='tile__date'
			key={index}>
			{date}
		</h3>
	));
	const renderBtns = data.front.btnsContent.map((btn, index) => (
		<a
			key={index}
			href={btn.link}
			className={`tile__btn tile__btn--${data.fileName}`}>
			{btn.text}
		</a>
	));

	return (
		<div
			className={conditionalClasses}
			onClick={clickable ? toggleModal : undefined}>
			{renderSingleImg}

			<h3 className='tile__title'>{data.front.title}</h3>

			{data.front.dates.length > 0 && renderDates}

			{data.front.location && <h4 className='tile__location'>{data.front.location}</h4>}

			{data.front.desc && <p className='tile__desc'>{data.front.desc}</p>}

			{data.front.btnsContent.length > 0 && renderBtns}

			{isModalOpen && (
				<Modal
					ref={modal}
					visited={isModalOpen}
					tile={data}
					singleImg={renderSingleImg}
					onClose={toggleModal}
					today={today}
				/>
			)}
		</div>
	);
}

export default Tile;
