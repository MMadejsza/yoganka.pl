function CampDay({dayData}) {
	return (
		<>
			<h4 className='modal__title--day'>{dayData.day}</h4>
			<ul className='modal__list'>
				{Object.entries(dayData).map(([time, activity], index) => {
					if (time != 'day') {
						return (
							<li
								key={index}
								className='modal__li'>
								<div>{time}</div>
								<div>{activity}</div>
							</li>
						);
					}
				})}
			</ul>
		</>
	);
}

export default CampDay;
