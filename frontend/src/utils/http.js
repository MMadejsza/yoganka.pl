// Util function for managing behavior of fetch for http requests
export async function fetchData(link) {
	console.log(`link: ${link}`);
	// await promise solve
	const response = await fetch(`/api${link}`);
	// if error
	if (!response.ok) {
		// instantiate error with message
		const error = new Error('Error occurs while fetching from db');
		// encode response status code
		error.code = response.status;
		// encode as message actual error from db
		error.info = await response.json();
		// return it for handling by tanstack
		throw error;
	}
	// if ok - translate response to json
	const data = response.json();
	// return it
	return data;
}
export async function create(link, formData) {
	console.log(`link: ${link}`);
	const response = await fetch(`/api${link}`, {
		method: 'POST',
		body: JSON.stringify(formData),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	if (!response.ok) {
		const error = new Error('❌ An error occurred while creating the event');
		error.code = response.status;
		error.info = await response.json();
		throw error;
	}

	const result = await response.json();
	console.log('✅ Serwer:', result);
	return result;
}
