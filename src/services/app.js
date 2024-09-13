const hamburger = document.getElementById('burger');
const campTiles = document.querySelectorAll('.tile.camp');
const body = document.body;

function toggleMenu() {
	hamburger.classList.toggle('active');
}

const showModal = (event) => {
	const tile = event.currentTarget;
	const targetModal = tile.querySelector('.modal');
	body.classList.toggle('stopScroll');
	if (targetModal) {
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
