function toggleMenu() {
	const hamburger = document.getElementById('burger');
	hamburger.classList.toggle('active');
}

const campTiles = document.querySelectorAll('.tile.camp');
const body = document.body;

const showModal = (event) => {
	const tile = event.currentTarget;
	const targetModal = tile.querySelector('.modal');
	body.classList.toggle('stopScroll');
	if (targetModal) {
		targetModal.classList.add('active');
		targetModal.scrollTop = 0;
	}
};

const closeModal = (event) => {
	event.stopPropagation(); // Zapobiega zamknięciu modala przez kliknięcie elementu `.tile.camp`
	const btn = event.currentTarget;
	const modal = btn.closest('.modal');
	if (modal) {
		modal.classList.remove('active');
	}
	body.classList.toggle('stopScroll');
};

campTiles.forEach((camp) => {
	camp.addEventListener('click', showModal);
	const closeButton = camp.querySelector('.btn_close');
	if (closeButton) {
		closeButton.addEventListener('click', closeModal);
	}
});
