import ImgDynamic from './imgsRelated/ImgDynamic.jsx';
function Tile({data}) {
	const imgPaths = [
		{path: `${data.imgPath}/320_${data.fileName}_0.jpg`, size: '320w'},
		{path: `${data.imgPath}/480_${data.fileName}_0.jpg`, size: '600w'},
	];
	return (
		<div className='tile'>
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
		</div>
	);
}

export default Tile;
