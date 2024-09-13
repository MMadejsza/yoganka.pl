const hamburger = document.getElementById('burger');
const campTiles = document.querySelectorAll('.tile.camp');
const body = document.body;

function toggleMenu() {
	hamburger.classList.toggle('active');
}

const showModal = (event) => {
	const tile = event.currentTarget;
	const targetModal = tile.querySelector('.modal');
	if (targetModal) {
		body.classList.toggle('stopScroll');
		targetModal.classList.add('active');
		hamburger.classList.toggle('hidden');
		targetModal.scrollTop = 0;
	}
};

const closeModal = (event) => {
	event.stopPropagation(); // Zapobiega zamknięciu modala przez kliknięcie elementu `.tile.camp`
	const btn = event.currentTarget;
	const modal = btn.closest('.modal');
	if (modal) {
		modal.classList.remove('active');
		hamburger.classList.toggle('hidden');
		body.classList.toggle('stopScroll');
	}
};

campTiles.forEach((camp) => {
	camp.addEventListener('click', showModal);
	const closeButton = camp.querySelector('.btn_close');
	if (closeButton) {
		closeButton.addEventListener('click', closeModal);
	}
});

document.addEventListener('DOMContentLoaded', function () {
	const enter = '%0A';
	const phoneNumber = '48792891607';
	const messageKaszuby = `Hej! Mam pytanie odnośnie wyjazdu na Kaszuby w październiku :)\n\nTu [imię] [Nazwisko]`;
	const messageWarmia = `Hej! Mam pytanie odnośnie wyjazdu na Warmię w listopadzie :)\n\nTu [imię] [Nazwisko]`;

	const linkKaszuby = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageKaszuby)}`;
	const linkWarmia = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageWarmia)}`;

	document.getElementById('whatsapp-kaszuby').href = linkKaszuby;
	document.getElementById('whatsapp-warmia').href = linkWarmia;
});
