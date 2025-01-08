export const smoothScrollInto = (e, navigate, location) => {
	console.log(location);
	e.preventDefault();
	navigate(`/`, {state: {background: location}});
	setTimeout(() => {
		// fetch prop href from clicked menu tile
		const targetSelector = e.target.getAttribute('data-scroll');
		console.log(targetSelector);
		// Find in Dom first element matching href
		const targetSection = document.querySelector(targetSelector);
		// If section exists - scroll to it
		if (targetSection) {
			// Apply desired way of scrolling
			targetSection.scrollIntoView({behavior: 'smooth'});
		}
	}, 500);
};
