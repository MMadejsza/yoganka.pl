document.addEventListener('DOMContentLoaded', function () {
	const body = document.body;
	const menuLinks = document.querySelectorAll('ul li a');
	const hamburger = document.getElementById('burger');
	const campTiles = document.querySelectorAll('.tile.camp');

	// functions
	const toggleMenu = () => {
		hamburger.classList.toggle('active');
	};
	let scrollFlag = 0;
	const showModal = (event) => {
		event.stopPropagation();
		const tile = event.currentTarget;
		const targetModal = tile.querySelector('.modal');
		if (targetModal) {
			body.classList.add('stopScroll');
			targetModal.classList.add('visible');
			hamburger.classList.add('hidden');
			if (scrollFlag) {
				targetModal.scrollTop = 0;
			}
			scrollFlag = 0;
		}
	};
	const closeModal = (event) => {
		event.stopPropagation(); // Zapobiega zamknięciu modala przez kliknięcie elementu `.tile.camp`
		const btn = event.currentTarget;
		const modal = btn.closest('.modal');
		if (modal) {
			modal.classList.remove('visible');
			hamburger.classList.remove('hidden');
			body.classList.remove('stopScroll');
			scrollFlag = 1;
		}
	};
	const whatsappTemplates = () => {
		const enter = '%0A';
		const phoneNumber = '48792891607';
		const msgKaszuby = `Hej! Mam pytanie odnośnie wyjazdu na Kaszuby w październiku :)\n\nTu [imię] [Nazwisko]`;
		const msgWarmia = `Hej! Mam pytanie odnośnie wyjazdu na Warmię w listopadzie :)\n\nTu [imię] [Nazwisko]`;
		const msgContact = `Hej! Piszę do Ciebie ze stronki yoganka.pl :)\n\nTu [imię] [Nazwisko]`;

		const linkKaszuby = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msgKaszuby)}`;
		const linkWarmia = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msgWarmia)}`;
		const linkContact = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msgContact)}`;

		document.getElementById('whatsapp-kaszuby').href = linkKaszuby;
		document.getElementById('whatsapp-warmia').href = linkWarmia;
		document.getElementById('whatsapp-contact').href = linkContact;
	};

	// application
	hamburger.addEventListener('click', () => toggleMenu());
	menuLinks.forEach((link) => {
		link.addEventListener('click', (event) => {
			// Pobierz atrybut href z klikniętego linku
			const targetSelector = link.getAttribute('href');

			// Znajdź pierwszy element z klasą odpowiadającą href
			const targetSection = document.querySelector(targetSelector);

			// Jeśli sekcja istnieje, przewiń do niej
			if (targetSection) {
				event.preventDefault(); // Zatrzymaj domyślne przewijanie
				toggleMenu();
				targetSection.scrollIntoView({behavior: 'smooth'});
			}
		});
	});
	campTiles.forEach((camp) => {
		camp.addEventListener('click', showModal);
		const closeButton = camp.querySelector('.btn_close');
		if (closeButton) {
			closeButton.addEventListener('click', closeModal);
		}
	});
	whatsappTemplates();

	const generateTile = () => {};
});
