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
