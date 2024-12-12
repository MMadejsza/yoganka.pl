export const smoothScrollInto = (e) => {
	e.preventDefault();
	// fetch prop href from clicked menu tile
	const targetSelector = e.target.getAttribute('href');
	// Find in Dom first element matching href
	const targetSection = document.querySelector(targetSelector);
	// If section exists - scroll to it
	if (targetSection) {
		// Apply desired way of scrolling
		targetSection.scrollIntoView({behavior: 'smooth'});
	}
};
