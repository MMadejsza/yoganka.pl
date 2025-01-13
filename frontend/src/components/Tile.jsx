import {useState} from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import ImgDynamic from './imgsRelated/ImgDynamic.jsx';
import Modal from './Modal.jsx';
import {smoothScrollInto} from '../utils/utils.js';

function Tile({data, today}) {
	const clickable = data.type !== 'class';
	const isPast = data.date < today;
	const navigate = useNavigate();
	const location = useLocation();
	const isModalPath = location.pathname === `/${data.fileName}`;
	const [isModalOpen, setIsModalOpen] = useState(isModalPath);

	const conditionalClasses = [
		'tile',
		clickable ? 'tile--clickable' : '',
		isPast ? 'past' : '',
		data.extraClass ? `tile--${data.extraClass}` : '',
	].join(' ');

	const handleOpenModal = () => {
		setIsModalOpen(true);
		navigate(`/${data.fileName}`, {state: {background: location}});
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		navigate(location.state?.background?.pathname || '/', {replace: true});
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
	const renderDates =
		// <div>
		// 	{
		data.front.dates.map((date, index) => (
			<h3
				className='tile__date'
				key={index}>
				{date}
			</h3>
		));
	// 	}
	// </div>
	const renderBtns = data.front.btnsContent.map((btn, index) => {
		if (btn.type === 'router') {
			return (
				<Link
					key={index}
					to={btn.link}
					className={`tile__btn tile__btn--${data.fileName}`}>
					{btn.icon ? <i className={btn.icon} /> : null}
					{btn.text}
				</Link>
			);
		} else {
			return (
				<a
					onClick={(e) => smoothScrollInto(e)}
					key={index}
					href={btn.link}
					className={`tile__btn tile__btn--${data.fileName}`}>
					{btn.icon ? (
						<i
							className={`${btn.icon} nav__icon`}
							style={{paddingRight: '1rem'}}></i>
					) : null}
					{btn.text}
				</a>
			);
		}
	});

	return (
		<div
			className={conditionalClasses}
			onClick={clickable ? handleOpenModal : undefined}>
			{renderSingleImg}

			<h3 className='tile__title'>{data.front.title}</h3>

			{data.front.dates.length > 0 && renderDates}

			{data.front.location && <h4 className='tile__location'>{data.front.location}</h4>}

			{data.front.desc && <p className='tile__desc'>{data.front.desc}</p>}

			{data.front.btnsContent.length > 0 && renderBtns}

			{isModalOpen && (
				<Modal
					visited={isModalOpen}
					tile={data}
					singleImg={renderSingleImg}
					onClose={handleCloseModal}
					today={today}
				/>
			)}
		</div>
	);
}

export default Tile;
