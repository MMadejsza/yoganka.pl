function CampGlance({glance}) {
	// const icons = {
	// 	area: 'fa-solid fa-location-dot',
	// 	accommodation: 'fa-solid fa-bed',
	// 	capacity: 'fa-solid fa-people-group',
	// 	price: 'fa-solid fa-tag',
	// 	travel: 'fa-solid fa-plane-departure',
	// };
	const icons = {
		area: 'location_on',
		accommodation: 'hotel',
		capacity: 'groups',
		price: 'sell',
		travel: 'local_taxi',
	};

	const renderItemsList = (data) => {
		return Object.entries(data)
			.filter(([key, text]) => key != 'title' && text)
			.map(([key, text], index) => (
				<li
					key={index}
					className='modal__li modal__li--at-glance'>
					{/* <i className={`${icons[key] || 'fa-solid fa-check'} modal__icon`} /> */}
					<span className='material-symbols-outlined modal__icon'>{icons[key]}</span>
					{text}
				</li>
			));
	};

	return (
		<>
			{glance.title && <h3 className='modal__title'>{glance.title}</h3>}
			<ul className='modal__list modal__list--at-glance'>{renderItemsList(glance)}</ul>
		</>
	);
}

export default CampGlance;
