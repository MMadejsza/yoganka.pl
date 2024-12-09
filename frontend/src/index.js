// Import of style moved to index.js due to troubles with proper vite bundling
import '../../node_modules/@glidejs/glide/dist/css/glide.core.min.css';
import '../../node_modules/@glidejs/glide/dist/css/glide.theme.min.css';
import Glide from '@glidejs/glide';
import '/src/styles/main.scss';

class Tile {
	scrollFlag = 1;

	// event listener to open modal
	showModal = () => {
		const modal = document.querySelector('.modal');
		// add classlist to modal
		modal.classList.add('visible');
		// "give status" to Dom to not scroll the entire page
		this.hamburger.classList.add('hidden');
		this.body.classList.add('stopScroll');
		// if scrolling allowed - flag == 1 -> disable
		if (this.scrollFlag) {
			modal.scrollTop = 0;
		}
	};
	// event listener to close modal
	closeModal = () => {
		const modal = document.querySelector('.modal__overlay');
		// remove classlist from modal
		modal.remove();
		// "give status" to Dom to not scroll the entire page
		this.hamburger.classList.remove('hidden');
		this.body.classList.remove('stopScroll');
		// allow scroll - update status
		this.scrollFlag = 1;
	};
	appendModal = () => {
		// Add modal if exists
		if (this.modal) {
			// create body overlay
			const overlay = this.createEl('div', {
				class: `modal__overlay`,
			});
			// create its main container
			const modal = this.createEl('div', {class: 'modal'});

			let modalBody;
			// call to build main modal body

			return overlay;
		}
	};

	generateTile = () => {
		// add listeners for opening and closing
		tile.addEventListener('click', (e) => {
			e.stopPropagation();
			const thisModal = this.appendModal();
			const thisGlide = thisModal.querySelector('.glide--comp');
			setTimeout(() => {
				this.showModal();
			}, 50);
			setTimeout(() => {
				if (thisGlide) {
					new Glide(thisGlide, {
						type: 'carousel',
						focusAt: 'center',
						perView: 2,
						startAt: 0,
						gap: 20,
						// autoplay: 2200,
						animationDuration: 800,
						breakpoints: {
							// <=
							360: {
								perView: 1,
							},
							480: {
								perView: 1,
							},
						},
					}).mount();
				}
			}, 500);
		});

		return tile;
	};
}
