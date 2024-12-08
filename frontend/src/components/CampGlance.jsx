function CampGlance({tile}) {
	const camp = tile.modal;
	const icons = {
		area: 'fa-solid fa-location-dot',
		accommodation: 'fa-solid fa-bed',
		capacity: 'fa-solid fa-people-group',
		price: 'fa-solid fa-tag',
	};
	return (
		<>
			{camp.glance.title && <h3 className='modal__title'>{camp.glance.title}</h3>}
			<ul className='modal__list modal__list--at-glance'>
				{Object.entries(camp.glance).map(([info, text], index) => {
					if (info != 'title' && text) {
						const rowName = info;
						return (
							<li
								key={index}
								className='modal__li modal__li--at-glance'>
								<i
									className={
										icons[rowName]
											? icons[rowName] + ' modal__icon'
											: 'fa-solid fa-check modal__icon'
									}
								/>
								{text}
							</li>
						);
					}
				})}
			</ul>
		</>
	);
}

export default CampGlance;
