import PhotoSlide from '../components/glide/PhotoSlide.jsx';

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
// function to replace the main contact btn's link
export const whatsAppTemplate = () => {
	const phoneNumber = '48792891607';
	const msgContact = `Hej! Piszę do Ciebie z yoganka.pl :)\n\nTu [imię] [Nazwisko]`;

	const linkContact = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msgContact)}`;

	return linkContact;
};
export const renderJointGalery = (campsArr, isMobile) => {
	const allPhotos = [];

	campsArr.forEach((camp) => {
		// For each com create array of gallery slides
		const singleCampGallery = Array.from({length: camp.gallerySize}).map((_, index) => (
			<PhotoSlide
				key={`${index}${camp.fileName}`}
				photoNo={index + 1}
				slideData={camp}
				isMobile={isMobile}
			/>
		));
		allPhotos.push(...singleCampGallery);
	});

	console.log(allPhotos.length);
	return allPhotos;
};