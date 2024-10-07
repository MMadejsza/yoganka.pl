// Created camps so far
const kaszubyCamp = {
	type: `camp`,
	extraClass: '',
	imgPath: '../static/img/offer/camps/camp_kaszuby/front',
	galleryPath: '../static/img/offer/camps/camp_kaszuby/gallery',
	fileName: `camp_kaszuby`,
	front: {
		nazwaWyjazdu: `Kojenie Zmysłów
	   Joga | Aromaterapia | SPA | SkinCare`,
		listaDat: [`11-13/10/2024`],
		rejon: `Kaszuby`,
	},
	modal: {
		imgModal: this.img,
		opis: `Zabieram Cię do urokliwego domku, otulonego drewnem, gdzie schowamy się w ulubionych skarpetach, ciepłych swetrach i ukoimy nasze zmysły. Nie zabraknie jesiennej klasyki, czyli odpoczynku przy kominku z kubkiem aromatycznego naparu.`,

		krotkieInfo: {
			naglowek: 'W skrócie:',
			nocleg: 'Dworek Krępkowice',
			liczbaMiejsc: '10',
			cena: '1200zł',
			// dojazd: 'we własnym zakresie',
		},

		plan: {
			naglowek: 'Slow menu:',
			tresc: [
				{
					'naglowekDnia': 'Piątek:',
					'16:00': 'Przyjazd, Spacery po okolicy',
					'18:00': 'Joga łagodna, relaksująca',
					'19:00': 'Zmysł smaku: wspólna kolacja',
					'21:00': `Zmysł dotyku: Skincare, czyli pielęgnacja twarzy, rozmowy przy kominku`,
				},
				{
					'naglowekDnia': 'Sobota:',
					'08:00': 'Ziołowy napar dla porannych ptaszków (dla chętnych)',
					'08:30': 'Zmysł równowagi: energetyczna Joga Slow Flow',
					'09:30': 'Niespieszne śniadanie',
					'CZAS WOLNY': '',
					'14:30': 'Obiad wegetariański',
					'16:00': 'Zmysł węchu: aromaterapia, warsztat świec bubble, wosków + wykład',
					'19:00': 'Uczta przy kolacji',
					'20:30': 'Joga, zmysł słuchu: krąg przy kominku',
				},
				{
					'naglowekDnia': 'Niedziela:',
					'08:30': `Zmysł propriocepcji*:                            	          	
												   Joga Slow Flow`,
					'09:30': 'Nieśpieszne śniadanie',
					'CZAS WOLNY': '',
					'13:00': 'Lunch i pożegnanie',
					'*': 'zmysł czucia głębokiego, ciała w przestrzeni',
				},
			],
		},
		wCenie: {
			naglowek: 'W Cenie:',
			tresc: [
				'4 praktyki jogi (Slow Flow, Hatha, Nidra)',
				'Warsztat świec i wosków',
				'Skin care',
				'Krąg',
				'Upominek',
				'Pobyt z Wyżywieniem',
				'Kawa / Herbata / Napary 24/h',
			],
		},
		pozaCena: {
			naglowek: 'We własnym zakresie:',
			tresc: ['Dojazd', 'Ubezpieczenie'],
		},
		extraPlatneOpcje: {
			naglowek: 'Poszerz Slow Menu:',
			tresc: ['Masaż Kobido 200zł/1h', 'Masaż Misami Tybetańskimi koszt na miejscu 150 zł'],
		},
		czasWolny: {
			naglowek: 'W Czasie Wolnym:',
			//(notka: statusy to free/optional/available o różnych ikonach)
			tresc: [
				{status: 'free', aktywnosc: 'Kocyk, leśne spacery, pogaduchy, zdrowe napary'},
				{status: 'optional', aktywnosc: 'Masaż Misami lub Kobido'},
				{status: 'optional', aktywnosc: 'Sauna z balią'},
			],
		},
		uwaga: `Zaserwuj sobie spokój i zdrowszą siebie. Wypełnij poniższe zgłoszenie`,
		// dodaj tresć btns
		linkFormularza: 'https://forms.gle/kYN6VpfP3aV1b9yB8',
		questionTemplate(subject) {
			return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
		},
	},
};
const warmiaCamp = {
	type: `camp`,
	extraClass: 'long',
	imgPath: '../static/img/offer/camps/camp_warmia/front',
	galleryPath: '../static/img/offer/camps/camp_warmia/gallery',
	fileName: `camp_warmia`,
	front: {
		nazwaWyjazdu: `Comfy slow weekend
          	Joga | Malowanie | SPA | Misy i gongi`,
		listaDat: [`08-11.11.2024`],
		rejon: `Warmia`,
	},
	modal: {
		imgModal: this.img,
		opis: `Tym razem jesienna odsłona uwielbianego przez was Witramowa. Oferta na długi weekend listopadowy. Zapraszam na 4 dni wypełnione jesiennym zapachem, ciepłem kominka i smakiem kultowej kuchni Agi i Piotra.`,
		krotkieInfo: {
			naglowek: 'W skrócie:',
			nocleg: 'Witramowo 32',
			liczbaMiejsc: '12',
			cena: '1600zł',
			// dojazd: 'we własnym zakresie',
		},
		plan: {
			naglowek: 'Slow menu:',
			tresc: [
				{
					'naglowekDnia': 'Piątek:',
					'16:00': 'Przyjazd, Spacery po okolicy',
					'18:00': 'Pyszna obiadokolacja',
					'19:00': 'Joga wieczorna',
					'21:00': `Wieczór przy kominku: rozmowy, napary`,
				},
				{
					'naglowekDnia': 'Sobota:',
					'08:30': 'Joga Slow Flow',
					'09:30': 'Niespieszne śniadanie',
					'CZAS WOLNY': '',
					'14:00': 'Obiad + słodki poczęstunek',
					'16:00': 'Malowanie intuicyjne przy koncercie mis i gongów',
					'18:30': 'Uczta przy kolacji',
					'20:00': 'Czas wspólny - sauna/balia/film',
				},
				{
					'naglowekDnia': 'Niedziela:',
					'08:30': `Joga energetyczna slow flow`,
					'09:30': 'Niespieszne śniadanie',
					'CZAS WOLNY': '',
					'14:30': 'Obiad i słodki poczęstunek',
					'17:00': 'Joga yin',
					'18:30': 'Kolacja',
					'20:00': 'Rozmowy w kręgu',
				},
				{
					'naglowekDnia': 'Poniedziałek:',
					'08:30': `Joga Slow Flow`,
					'09:30': 'Niespieszne śniadanie',
					'CZAS WOLNY': '',
					'13:00': 'Lunch i pożegnanie',
				},
			],
		},
		wCenie: {
			naglowek: 'W Cenie:',
			tresc: [
				'6 praktyk jogi',
				'Malowanie intuicyjne',
				'Koncert mis i gongów',
				'Krąg',
				'Upominek',
				'Pobyt z Wyżywieniem',
				'Kawa / Herbata / Napary 24/h',
			],
		},
		pozaCena: {
			naglowek: 'We własnym zakresie:',
			tresc: ['Dojazd', 'Ubezpieczenie'],
		},
		extraPlatneOpcje: {
			naglowek: 'Poszerz Slow Menu:',
			tresc: [
				'Masaż Kobido 30zł/30min',
				'Masaż Misami Tybetańskimi 120 zł/45min',
				'Sauna z balią',
			],
		},
		czasWolny: {
			naglowek: 'W Czasie Wolnym:',
			//(notka: statusy to free/optional/available o różnych ikonach)
			tresc: [
				{status: 'free', aktywnosc: 'Kocyk, leśne spacery, pogaduchy, zdrowe napary'},
				{status: 'optional', aktywnosc: 'Masaż Misami lub Kobido'},
				{status: 'optional', aktywnosc: 'Sauna z balią'},
			],
		},
		uwaga: `Zaserwuj sobie spokój i zdrowszą siebie. Wypełnij poniższe zgłoszenie`,
		linkFormularza: 'https://forms.gle/6Ri5sqnXgUQGSRNT9',
		questionTemplate(subject) {
			return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
		},
	},
};
// Created active classes so far
const yogaAndSound = {
	type: `event`,
	extraClass: 'event',
	imgPath: '../static/img/offer/events/yoga&sound/front',
	galleryPath: '../static/img/offer/events/yoga&sound/front',
	fileName: `ys`,
	front: {
		nazwaWyjazdu: `YOGA & SOUND
		Moon Ceremony`,
		listaDat: [`20.10.2024 godz.18.00`],
		rejon: `WellMe, Gdańsk Oliwa`,
		krotkiOpis: `Spotkania przy pełni księżyca, czyli joga przy dźwiękach mis i gongów, które wprowadzą Cię w relaksującą podróż.`,
	},
	modal: {
		imgModal: this.img,
		tytulOpisu: 'W skrócie:',
		pelnyOpis: `Takiego spotkania w trójmieście jeszcze nie było. Joga, księżyc, misy i gongi łączą siły.  Poczuj ich dobroczynną moc, pozwól sobie na regenerację,oczyść głowę. Twoje ciało będzie wdzięczne za taki relaks.
 Latem spotykamy się na plaży, w sezonie jesienno-zimowym przenosimy się na przytulne sale na terenie całego Trójmiasta.`,
		program: {
			naglowek: 'Relaks menu:',
			tresc: [
				`Joga przy dźwiękach mis i gongów ( Agnieszka Topp)`,
				`Relaks  z opaską na oczach nasączona aromatycznymi olejkami`,
				`Zdrowy napar naszego przepisu`,
				`Insporujące rozmowy w kręgu`,
				`Upominek`,
				`Maty od partnera Miś Yoga`,
			],
		},
		linkFormularza: 'https://forms.gle/fcFCL8HMqWBmEn7P7  ',
		// questionTemplate(subject) {
		// 	return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
		// },
	},
};
const yogaNaSupach = {
	type: `event`,
	extraClass: 'event',
	imgPath: '../static/img/offer/events/sup/front',
	galleryPath: '../static/img/offer/events/sup/front',
	fileName: `sup`,
	front: {
		nazwaWyjazdu: `Yoga na Supach`,
		listaDat: [`(Sezon Letni)`],
		rejon: `Plaża Trójmiasto`,
		krotkiOpis: `Nie bój się zmoczyć... Extra mobilizacja mięśni głębokich i stabilizujących`,
	},
	modal: {
		imgModal: this.img,
		tytulOpisu: 'W skrócie:',
		pelnyOpis: `Latem zapraszam do wodnego studio jogi. Otwarta przestrzeń z  nieskończonym oknem na naturę stanowi doskonałą propozycję na ciepłe dni. Deska SUP zamiast maty, promienie słońca, letni podmuch wiatru i szum drzew dodadzą Twojej praktyce lekkości. Poprawisz balans, wzmocnisz mięśnie posturalne, zrelaksujesz się czując delikatne muskanie fal. Zobacz fotorelację z sezonu 2023 oraz 2024. Zajęcia odbywały się na jeziorze oraz w Zatoce Gdańskiej (Brzeźno).`,
		linkFormularza: 'https://forms.gle/kYN6VpfP3aV1b9yB8',
		// questionTemplate(subject) {
		// 	return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
		// },
	},
};

// class tile template
class Tile {
	scrollFlag = 1;

	// constructor destructuring template camp offer
	constructor(givenEventBody) {
		this.type = givenEventBody.type;
		this.extraClass = givenEventBody.extraClass;
		this.imgPath = givenEventBody.imgPath;
		this.galleryPath = givenEventBody.galleryPath;
		this.fileName = givenEventBody.fileName;
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
					footerBtnSignUp.innerText = 'Dołącz!';
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
		const img = this.generateGallerySlider(this.galleryPath, this.fileName, 5);
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
		const icons = [
			'fa-solid fa-location-dot',
			'fa-solid fa-bed',
			'fa-solid fa-people-group',
			'fa-solid fa-tag',
		];
		// iterate after modal's "at glance" part
		Object.entries(this.modal.krotkieInfo).forEach(([info, text], index) => {
			// omit title:
			if (index > 0) {
				// create li
				const li = this.createEl('li', {class: 'modal__li modal__li--at-glance'});
				// create icon choosing the right one in order
				const icon = this.createEl('i', {
					class: icons[index]
						? icons[index] + ' modal__icon'
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
		//@ section modal_excluded
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
		//@ attention
		// create a footer with 2 buttons to cause and action
		// @ footer modal_user-action
		const attentionNote = this.createEl('h2', {
			class: 'modal__attention-note',
		});
		attentionNote.innerText = this.modal.uwaga;
		modalOffer.appendChild(attentionNote);
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
			class: `modal__desc modal__desc--${this.type} ${
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
		for (let i = 0; i <= imgsNumber; i++) {
			const imgNo = i + 1;
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
const activeCamps = [kaszubyCamp, warmiaCamp];
// list of active camps to sign for
const activeEvents = [yogaAndSound, yogaNaSupach];

// do when DOM loaded
document.addEventListener('DOMContentLoaded', function () {
	const menuLinks = document.querySelectorAll('ul li a');
	const hamburger = document.getElementById('burger');
	const wyjazdy = document.querySelector('#wyjazdy');
	const wydarzenia = document.querySelector('#wydarzenia');

	const toggleMenu = () => {
		hamburger.classList.toggle('active');
	};
	// function to replace the main contact btn's link
	const whatsappTemplates = () => {
		const phoneNumber = '48792891607';
		const msgContact = `Hej! Piszę do Ciebie z yoganka.pl :)\n\nTu [imię] [Nazwisko]`;

		const linkContact = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msgContact)}`;

		document.getElementById('whatsapp-contact').href = linkContact;
	};

	hamburger.addEventListener('click', () => toggleMenu());
	menuLinks.forEach((link) => {
		link.addEventListener('click', (event) => {
			// fetch prop href from clicked menu tile
			const targetSelector = link.getAttribute('href');
			// Find in Dom first element matching href
			const targetSection = document.querySelector(targetSelector);
			// If section exists - scroll to it
			if (targetSection) {
				// Prevent default way of scrolling
				event.preventDefault();
				toggleMenu();
				// Apply desired way of scrolling
				targetSection.scrollIntoView({behavior: 'smooth'});
			}
		});
	});

	whatsappTemplates();

	// generate offered camps for website
	activeCamps.forEach((camp) => {
		wyjazdy.appendChild(new Tile(camp).generateTile());
	});
	activeEvents.forEach((event) => {
		wydarzenia.appendChild(new Tile(event).generateTile());
	});

	// cookies elements
	document
		.querySelector('.footer__pop-up-btn--cookies')
		.addEventListener('click', (e) => e.preventDefault());
	document.querySelector('.footer__cookie-close').addEventListener('click', (e) => {
		const parent = e.target.closest('.footer__pop-up-btn--cookies');
		parent.style.opacity = 0;
		setTimeout(() => {
			parent.style.display = 'none';
		}, 800);
	});
	// newsletter close
	document.querySelector('.footer__pop-up-btn--gift').addEventListener('click', (e) => {
		if (e.target.parentNode.classList.contains('footer__pop-up-btn--gift')) {
			e.target.style.opacity = 0;
			e.target.parentNode.style.opacity = 0;
			setTimeout(() => {
				e.target.parentNode.remove();
				e.target.remove();
			}, 800);
		} else {
			e.target.style.opacity = 0;
			setTimeout(() => {
				e.target.remove();
			}, 800);
		}
	});

	const glide = new Glide('.glide', {
		type: 'carousel',
		// startAt: 0,
		perView: 5,
		focusAt: 'center',
		gap: 20,
		autoplay: 2200,
		animationDuration: 800,
		breakpoints: {
			// <=
			360: {
				perView: 1,
			},
			480: {
				perView: 2,
			},
			1024: {
				perView: 3,
			},
		},
	});

	glide.mount();
});
