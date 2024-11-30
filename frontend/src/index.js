// Import of style moved to index.js due to troubles with proper vite bundling
import '../../node_modules/@glidejs/glide/dist/css/glide.core.min.css';
import '../../node_modules/@glidejs/glide/dist/css/glide.theme.min.css';
import Glide from '@glidejs/glide';
import '/src/styles/main.scss';
import {CAMPS_DATA} from './DATA/CAMPS_DATA';
import {EVENTS_DATA} from './DATA/EVENTS_DATA';

// Get todays date
const todayRaw = new Date();
const today = todayRaw.toISOString().split('T')[0]; // "YYYY-MM-DD"

// class tile template
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

	// Util function for creating elements with possible multiple attributes
	createEl = (el, attributes) => {
		const element = document.createElement(el);
		// Attributes is objects with prop=value elements
		if (attributes) {
			for (var key in attributes) {
				element.setAttribute(key, attributes[key]);
			}
		}
		return element;
	};

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
			// create its close btn
			const X = this.createEl('div', {class: 'modal__x-btn'});
			const Xa = this.createEl('a', {class: 'modal__close-btn'});
			const Xai = this.createEl('i', {class: 'fa-solid fa-xmark modal__icon'});
			Xa.appendChild(Xai);
			X.addEventListener('click', (e) => {
				e.stopPropagation();
				this.closeModal();
			});
			X.appendChild(Xa);
			modal.appendChild(X);

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
	generateModalBtns = (root, typesArr) => {
		typesArr.forEach((type) => {
			switch (type) {
				case 'sign':
					// use address  from camps dataset
					const footerBtnSignUp = this.createEl('a', {
						href: this.modal.linkFormularza,
						class: 'modal__btn modal__sign-up',
						target: '_blank',
					});
					footerBtnSignUp.innerText = 'Dołączam';
					root.append(footerBtnSignUp);
					break;
				case 'ask':
					const modalQuestion = this.modal.questionTemplate(this.frontTitle);
					const footerBtnAsk = this.createEl('a', {
						href: `https://wa.me/${48792891607}?text=${encodeURIComponent(
							modalQuestion ? modalQuestion : '',
						)}`,
						class: 'modal__btn modal__ask-for-info',
						target: '_blank',
					});
					footerBtnAsk.innerText = 'Zapytaj';
					root.append(footerBtnAsk);
					break;
				default:
					console.log('No modalBtn type');
					break;
			}
		});
	};
	// main function generating and returning tile
	generateTile = () => {
		function appendEl(parent, ...args) {
			args.forEach((el) => parent.appendChild(el));
		}
		// Create separate tags
		const tile = this.createEl('div', {class: 'tile clickable'});
		// If for example "long" class required what triggers different grid layout
		if (this.extraClass) {
			tile.classList.add(`tile--${this.extraClass}`);
		}
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
		const frontTitle = this.createEl('h3', {class: 'tile__title'});
		frontTitle.innerText = this.frontTitle;
		const frontDates = [];
		this.frontDate.forEach((el) => {
			const frontDate = this.createEl('h3', {class: 'tile__date'});
			frontDate.innerText = el;
			frontDates.push(frontDate);
		});
		const frontLocation = this.createEl('h4', {class: 'tile__location'});
		frontLocation.innerText = this.frontLocation;

		// Append those tags
		appendEl(tile, img, frontTitle, ...frontDates, frontLocation);
		if (this.frontDesc) {
			const frontDesc = this.createEl('p', {class: 'tile__desc'});
			frontDesc.innerText = this.frontDesc;
			tile.appendChild(frontDesc);
		}

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

		// archive if after today's date
		if (this.date < today) {
			tile.classList.add('past');
			// remove the past price
			if (this.modal) {
				this.modal.krotkieInfo.cena = '-';
			}
		}

		return tile;
	};

	// util function for modal body to simplify the code. Generates small sections with lists on the bottom
	tileModalChecklistClassic = (checklistName, icon, listClass) => {
		const content = this.modal[checklistName];
		// create list general container
		const section = this.createEl('section', {class: listClass});
		// create list general container header
		const sectionHeader = this.createEl('h3', {class: 'modal-checklist__title'});
		sectionHeader.innerText = content.naglowek;
		section.appendChild(sectionHeader);
		// create list container
		const sectionList = this.createEl('ul', {class: 'modal-checklist__list'});
		// create list items
		content.tresc.forEach((item) => {
			// create li
			const li = this.createEl('li', {class: 'modal-checklist__li'});
			// assign icon parameter
			let iconClass = icon;
			// check if iterates after simple array or array of objects which is for //#Free-Time only
			if (item.status != undefined) {
				// if first item isn't free which means its icon is different than standard default one
				if (item.status != 'free') {
					iconClass =
						item.status == 'optional'
							? 'fa-solid fa-plus modal__icon'
							: 'fa-regular fa-hand-point-right modal__icon';
				}
				// create chosen icon
				const chosenIcon = this.createEl('i', {class: iconClass});
				// append it
				li.append(chosenIcon, item.aktywnosc);
			} else {
				// create standard icon
				const includedIcon = this.createEl('i', {class: icon});
				li.append(includedIcon, item);
			}
			// append created li
			sectionList.appendChild(li);
		});
		// append created list and return it
		section.appendChild(sectionList);
		return section;
	};
	generateTileModalCamp = () => {
		// create main container
		const modalOffer = this.createEl('div', {
			class: `modal__modal-body modal__modal-body--offer `,
		});
		//@ img
		const img = this.generateGallerySlider(this.galleryPath, this.fileName, this.gallerySize);
		modalOffer.appendChild(img);

		//@ section modal_full-desc
		// create main container
		const sectionFullDesc = this.createEl('section', {
			class: `modal__full-desc modal__full-desc--${this.extraClass ? this.extraClass : ''}`,
		});
		const fullDescContent = this.createEl('p', {class: 'modal__full-desc-content'});
		fullDescContent.innerText = this.modal.opis;
		sectionFullDesc.append(fullDescContent);
		modalOffer.append(sectionFullDesc);

		//@ glance
		const glance = this.createEl('header', {class: 'modal__header'});
		// create header container h3
		const glanceHeader = this.createEl('h3', {class: 'modal__title'});
		glanceHeader.innerText = this.modal.krotkieInfo.naglowek;
		glance.appendChild(glanceHeader);
		const ul = this.createEl('ul', {class: 'modal__list modal__list--at-glance'});
		// point list of icons to include in order
		const icons = {
			rejon: 'fa-solid fa-location-dot',
			nocleg: 'fa-solid fa-bed',
			liczbaMiejsc: 'fa-solid fa-people-group',
			cena: 'fa-solid fa-tag',
		};
		// iterate after modal's "at glance" part
		Object.entries(this.modal.krotkieInfo).forEach(([info, text], index) => {
			const rowName = info;
			// omit title:
			if (index > 0) {
				// create li
				const li = this.createEl('li', {class: 'modal__li modal__li--at-glance'});
				// create icon choosing the right one in order
				const icon = this.createEl('i', {
					class: icons[rowName]
						? icons[rowName] + ' modal__icon'
						: 'fa-solid fa-check modal__icon',
				});
				// append icon + text from glance array
				li.append(icon, text);
				// append li
				ul.appendChild(li);
			}
		});
		// append list in header
		glance.appendChild(ul);
		// append complete header
		modalOffer.appendChild(glance);
		//@ section modal_plan
		// create modal plan for camp
		//@ section modal_desc
		// create main container
		const sectionDesc = this.createEl('section', {
			class: `modal__desc modal__desc--${this.extraClass ? this.extraClass : ''}`,
		});
		// create header container h3
		const sectionDescHeader = this.createEl('h3', {class: 'modal__title'});
		// create icon
		// const sectionDescHeaderI = this.createEl('i', {
		// 	class: 'fa-solid fa-list-check modal__icon',
		// });
		// populate header with icon and text
		sectionDescHeader.append(/*sectionDescHeaderI,*/ this.modal.plan.naglowek);
		// append ready section header
		sectionDesc.appendChild(sectionDescHeader);
		// iterate after array of days objects
		this.modal.plan.tresc.forEach((campDay) => {
			// create days header
			const dayHeader = this.createEl('h4', {class: 'modal__title--day'});
			dayHeader.innerText = campDay.naglowekDnia;
			// create container for day's list of activities
			const dayPlan = this.createEl('ul', {class: 'modal__list'});
			// get day object keys
			const keys = Object.keys(campDay);
			// start from 2nd one to avoid days name
			for (let i = 1; i < keys.length; i++) {
				const time = keys[i];
				const timeContainer = this.createEl('div');
				timeContainer.innerText = time;
				const activity = this.createEl('div');
				activity.innerText = campDay[time];
				const li = this.createEl('li', {class: 'modal__li'});
				li.append(timeContainer, activity);
				dayPlan.appendChild(li);
			}
			sectionDesc.append(dayHeader, dayPlan);
		});
		modalOffer.appendChild(sectionDesc);

		//@ section modal_included
		// create section for what's included using util function and custom parameters
		const sectionIncluded = this.tileModalChecklistClassic(
			'wCenie',
			'fa-solid fa-check modal__icon modal-checklist__icon',
			'modal-checklist modal-checklist--included',
		);
		modalOffer.appendChild(sectionIncluded);
		// section modal_excluded
		// create section for what's excluded
		// const sectionExcluded = this.tileModalChecklistClassic(
		// 	'pozaCena',
		// 	'fa-regular fa-hand-point-right modal__icon modal-checklist__icon',
		// 	'modal-checklist modal-checklist--excluded',
		// );
		// modalOffer.appendChild(sectionExcluded);
		//@ section modal_optional
		// create section for what's optional to buy
		const sectionOptional = this.tileModalChecklistClassic(
			'extraPlatneOpcje',
			'fa-solid fa-plus modal__icon modal-checklist__icon',
			'modal-checklist modal-checklist--optional',
		);
		modalOffer.appendChild(sectionOptional);
		//@ section modal_free-time
		// create section for what's possible to do in free time
		const sectionFreeTime = this.tileModalChecklistClassic(
			'czasWolny',
			'fa-solid fa-check modal__icon modal-checklist__icon',
			'modal-checklist modal-checklist--free-time',
		);
		modalOffer.appendChild(sectionFreeTime);

		// archive if after today's date
		if (this.date >= today) {
			//@ attention
			// create a footer with 2 buttons to cause and action
			// @ footer modal_user-action
			const attentionNote = this.createEl('h2', {
				class: 'modal__attention-note',
			});
			attentionNote.innerText = this.modal.uwaga;
			modalOffer.appendChild(attentionNote);

			// @ footer modal_user-action
			// create a footer with 2 buttons to cause and action
			const footer = this.createEl('footer', {
				class: 'modal__user-action',
			});

			// use address  from camps dataset
			this.generateModalBtns(footer, ['sign']);

			modalOffer.appendChild(footer);
		}
		// return complete modal body
		return modalOffer;
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
			const glideSlideLi = this.createEl('li', {
				class: 'glide__slide',
			});
			glideSlideLi.appendChild(image);
			glideSlides.appendChild(glideSlideLi);
		}
		glideTrack.appendChild(glideSlides);

		const glideBullets = this.createEl('div', {
			'class': 'glide__bullets',
			'data-glide-el': 'controls[nav]',
		});
		for (let i = 1; i <= imgsNumber; i++) {
			const glideBullet = this.createEl('button', {
				'class': 'glide__bullet',
				'data-glide-dir': `=${i}`,
			});
			glideBullets.appendChild(glideBullet);
		}
		glide.appendChild(glideTrack);
		glide.appendChild(glideBullets);

		const glideArrows = this.createEl('div', {
			'class': 'glide__arrows',
			'data-glide-el': `controls`,
		});
		const glideArrowLeft = this.createEl('button', {
			'class': 'glide__arrow glide__arrow--left',
			'data-glide-dir': `<`,
		});
		const iconArrowLeft = this.createEl('i', {
			class: 'fa-solid fa-chevron-left',
		});
		glideArrowLeft.appendChild(iconArrowLeft);
		const glideArrowRight = this.createEl('button', {
			'class': 'glide__arrow glide__arrow--right',
			'data-glide-dir': `>`,
		});
		const iconArrowRight = this.createEl('i', {
			class: 'fa-solid fa-chevron-right',
		});
		glideArrowRight.appendChild(iconArrowRight);
		glideArrows.append(glideArrowLeft, glideArrowRight);
		glide.appendChild(glideArrows);

		return glide;
	};
}

// list of active camps to sign for
const unSortedCamps = CAMPS_DATA;
const activeCamps = unSortedCamps.sort((x, y) => new Date(y.date) - new Date(x.date));
// list of active camps to sign for
const unsortedEvents = EVENTS_DATA;
const activeEvents = unsortedEvents.sort((x, y) => {
	// sort by type: "fixed" przed "repetitive"
	if (x.eventType === 'fixed' && y.eventType !== 'fixed') {
		return -1; // x (fixed) before y (repetitive)
	} else if (x.eventType !== 'fixed' && y.eventType === 'fixed') {
		return 1; // y (fixed) before x (repetitive)
	}

	// By date
	return new Date(x.date) - new Date(y.date); // ascending
});

// do when DOM loaded
document.addEventListener('DOMContentLoaded', function () {
	const wyjazdy = document.querySelector('#wyjazdy');
	const wydarzenia = document.querySelector('#wydarzenia');

	// generate offered camps for website
	activeCamps.forEach((camp) => {
		wyjazdy.appendChild(new Tile(camp).generateTile());
	});
	activeEvents.forEach((event) => {
		wydarzenia.appendChild(new Tile(event).generateTile());
	});
});
