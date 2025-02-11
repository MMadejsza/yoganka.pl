const formatIsoDateTime = (isoString) => {
	// Create object Date
	const date = new Date(isoString);

	// format [date] [time (hh:mm)]
	const formattedDate = date.toLocaleString('pl-PL', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});
	let formattedTime;
	if (isoString?.length != 10) {
		formattedTime = date.toLocaleString('pl-PL', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		});
	} else formattedTime = '';

	// Concat
	return `${formattedDate} ${formattedTime}`;
};
export default formatIsoDateTime;
