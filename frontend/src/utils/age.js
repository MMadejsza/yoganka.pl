export function calculateAge(dateString) {
	const birthDate = new Date(dateString);
	const today = new Date();
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();

	// Decrease if before birthday
	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}
	return age;
}
