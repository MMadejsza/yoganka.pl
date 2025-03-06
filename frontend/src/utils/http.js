import {QueryClient} from '@tanstack/react-query';
export const queryClient = new QueryClient();

// Util function for managing behavior of fetch for http requests

export async function fetchStatus() {
	// await promise solve
	const response = await fetch(`/api/login-pass/status`, {credentials: 'include'});
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
	const data = await response.json();
	// return it
	return data;
}

export async function fetchData(link) {
	// console.log(`fetchData link: ${link}`);
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
export async function create(link, status, formData) {
	console.log(`create link: ${link}`);
	const response = await fetch(`/api${link}`, {
		method: 'POST',
		body: JSON.stringify(formData),
		headers: {
			'Content-Type': 'application/json',
			'CSRF-Token': status.token,
		},
	});
	if (!response.ok) {
		const error = new Error('❌ An error occurred while creating the event');
		error.code = response.status;
		error.info = await response.json();
		throw error;
	}

	const result = await response.json();
	// console.log('✅ Serwer:', result);
	return result;
}

export async function fetchItem(callPath, {signal}, minRightsPrefix) {
	console.log('✅✅✅ fetchItem Called');
	console.log('✅✅✅ callPath ', callPath);
	if (minRightsPrefix) {
		console.log('✅✅✅ minRightsPrefix ', minRightsPrefix);
	}

	const response = await fetch(`/api${minRightsPrefix || ''}${callPath}`, {
		signal,
		cache: 'no-store',
	});

	if (!response.ok) {
		const error = new Error('An error occurred while fetching the item');
		error.code = response.status;
		error.info = await response.json();
		throw error;
	}

	const data = await response.json();
	return data;
}

export async function deleteItem({id}) {
	const response = await fetch(`api/show-all-users/${id}`, {
		method: 'DELETE',
	});

	if (!response.ok) {
		const error = new Error('An error occurred while deleting the event');
		error.code = response.status;
		error.info = await response.json();
		throw error;
	}

	return response.json();
}
