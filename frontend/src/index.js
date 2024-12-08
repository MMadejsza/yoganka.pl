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
			if (this.type == 'camp') {
				modalBody = this.generateTileModalCamp();
			} else if (this.type == 'event') {
				modalBody = this.generateTileModalEvent();
			}
			modal.appendChild(modalBody);
			overlay.append(modal);
			document.body.appendChild(overlay);
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

	generateGallerySlider = (relativePath, imgName, imgsNumber) => {
		// const glideContainer = this.createEl('div', {class: 'glide-container'});
		const glide = this.createEl('div', {class: 'glide glide--comp'});
		const glideTrack = this.createEl('div', {
			'class': 'glide__track',
			'data-glide-el': 'track',
		});
		const glideSlides = this.createEl('ul', {
			class: 'glide__slides',
		});
		for (let i = 1; i <= imgsNumber; i++) {
			const imgNo = i;
			const image = this.createEl('img', {
				class: 'tile__img tile__img--modal-slider',
				src: `${relativePath}/480_${imgName}_${imgNo}.png`,
				srcset: `
						${relativePath}/320_${imgName}_${imgNo}.jpg 480w,
						${relativePath}/480_${imgName}_${imgNo}.jpg 768w,
						${relativePath}/768_${imgName}_${imgNo}.jpg 1024w,
						${relativePath}/1024_${imgName}_${imgNo}.jpg 1400w,
						${relativePath}/1200_${imgName}_${imgNo}.jpg 1600w
						`,
				sizes: `
						(max-width: 768px) 480px,
						(max-width: 1024px) and (orientation: portrait) 1024px,
						(max-width: 1200px) 1400px,
						1600px
						`,
				loading: 'lazy',
				alt: 'Galeria Wyjazdu',
			});
		}
		glideTrack.appendChild(glideSlides);
	};
}
