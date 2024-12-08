function ModalList({listType, data}) {
	const icons = {
		included: 'fa-solid fa-check modal__icon modal-checklist__icon',
		excluded: 'fa-regular fa-hand-point-right modal__icon modal-checklist__icon',
		optional: 'fa-solid fa-plus modal__icon modal-checklist__icon',
		freeTime: 'fa-brands fa-pagelines modal__icon modal-checklist__icon',
	};
	let iconClasses;
	let content;

	switch (listType) {
		case 'included':
			iconClasses = icons.included;
			break;
		case 'excluded':
			iconClasses = icons.excluded;
			break;
		case 'optional':
			iconClasses = icons.optional;
			break;
		case 'freeTime':
			iconClasses = icons.freeTime;
			content = data.list.map((item, index) => {
				let dynamicIcon = iconClasses;
				if (item.status != 'free') {
					dynamicIcon = item.status == 'optional' ? icons.optional : iconClasses;
				}
				return (
					<li
						key={index}
						className='modal-checklist__li'>
						<i
							className={dynamicIcon}
							aria-hidden='true'></i>
						{item.activity}
					</li>
				);
			});
			break;
		default:
			iconClasses = icons.freeTime;
			break;
	}

	if (listType !== 'freeTime') {
		content = data.list.map((activity, index) => (
			<li
				key={index}
				className='modal-checklist__li'>
				<i
					className={iconClasses}
					aria-hidden='true'></i>
				{activity}
			</li>
		));
	}

	return (
		<>
			<section
				className={`modal-checklist modal-checklist--${
					listType === 'freeTime' ? 'free-time' : listType
				}`}>
				<h3 className='modal-checklist__title'>{data.title}</h3>
				<ul className='modal-checklist__list'>{content}</ul>
			</section>
		</>
	);
}

export default ModalList;
