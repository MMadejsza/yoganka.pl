// Import of style moved to index.js due to troubles with proper vite bundling
import '../../node_modules/@glidejs/glide/dist/css/glide.core.min.css';
import '../../node_modules/@glidejs/glide/dist/css/glide.theme.min.css';
import Glide from '@glidejs/glide';
import '/src/styles/main.scss';

class Tile {
	scrollFlag = 1;

	// constructor destructuring template camp offer
	constructor(givenEventBody) {
		this.type = givenEventBody.type;
		this.extraClass = givenEventBody.extraClass;
		this.imgPath = givenEventBody.imgPath;
		this.galleryPath = givenEventBody.galleryPath;
		this.gallerySize = givenEventBody.gallerySize;
		this.fileName = givenEventBody.fileName;
		this.date = givenEventBody.date;
		this.frontTitle = givenEventBody.front.nazwaWyjazdu;
		this.frontDate = givenEventBody.front.listaDat;
		this.frontLocation = givenEventBody.front.rejon;
		this.frontDesc = givenEventBody.front.krotkiOpis;
		this.modal = givenEventBody.modal;
		this.hamburger = document.getElementById('burger');
		this.body = document.body;
	}

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

	generateTileModalEvent = () => {
		// create main container
		const modalOffer = this.createEl('div', {
			class: `modal__modal-body modal__modal-body--offer modal__modal-body--event`,
		});
		//@ img
		const img = this.createEl('img', {
			class: 'tile__img',
			srcset: `
					${this.imgPath}/320_${this.fileName}_0.jpg 320w,
					${this.imgPath}/480_${this.fileName}_0.jpg 480w,
					`,
			sizes: `
					(max-width: 640px) 320px,
					(max-width: 768px) 480px,
					480px
					`,
			src: `${this.imgPath}/480_${this.fileName}_0.jpg`,
			loading: 'lazy',
		});
		modalOffer.appendChild(img);
		// const img = this.generateGallerySlider(this.galleryPath, this.fileName, 1);
		modalOffer.appendChild(img);

		//@ header
		// create modal plan for camp
		//@ section modal_desc
		// create main container
		const sectionDesc = this.createEl('section', {
			class: `modal__full-desc modal__full-desc--${this.type} ${
				this.extraClass ? this.extraClass : ''
			}`,
		});
		// create header container h3
		const sectionDescHeader = this.createEl('h3', {class: 'modal__title'});
		// create icon
		// populate header with icon and text
		sectionDescHeader.innerText = this.modal.tytulOpisu;
		// append ready section header
		sectionDesc.appendChild(sectionDescHeader);
		// create desc
		const sectionDescContent = this.createEl('p', {class: 'modal__paragraph'});
		sectionDescContent.innerText = this.modal.pelnyOpis;
		sectionDesc.append(sectionDescContent);
		modalOffer.appendChild(sectionDesc);

		//@ section modal_included
		// create section for what's included using util function and custom parameters
		if (this.modal.program) {
			const sectionIncluded = this.tileModalChecklistClassic(
				'program',
				'fa-solid fa-check modal__icon modal-checklist__icon',
				'modal-checklist modal-checklist--included modal-checklist--event',
			);
			modalOffer.appendChild(sectionIncluded);
		}
		//@ attention
		// create a footer with 2 buttons to cause and action
		// @ footer modal_user-action
		if (this.modal.uwaga) {
			const attentionNote = this.createEl('h2', {
				class: 'modal__attention-note',
			});
			attentionNote.innerText = this.modal.uwaga;
			modalOffer.appendChild(attentionNote);
		}
		// create a footer with 2 buttons to cause and action
		// @ footer modal_user-action
		const footer = this.createEl('footer', {
			class: 'modal__user-action',
		});
		// use address  from camps dataset
		this.generateModalBtns(footer, ['sign']);
		modalOffer.appendChild(footer);

		// return complete modal body
		return modalOffer;
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
