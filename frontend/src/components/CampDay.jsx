function CampDay({dayData}) {
	const {day, ...schedule} = dayData;
	return (
		<>
			<h4 className='modal__title--day'>{day}</h4>
			<ul className='modal__list'>
				{Object.entries(schedule).map(([time, activity], index) => {
					return (
						<li
							key={index}
							className='modal__li'>
							<div>{time}</div>
							<div>{activity}</div>
						</li>
					);
				})}
			</ul>
		</>
	);
}

export default CampDay;
