// Created camps so far
const kaszubyCamp = {
	type: `camp`,
	extraClass: '',
	img: '../static/img/offer/camp_kaszuby.png',
	front: {
		frontTitle: `Kojenie Zmysłów
		Yoga | Aromaterapia | SPA`,
		frontDate: [`11-13/10/2024`],
		frontLocation: `Kaszuby`,
		frontDesc: `Zabieram Cię do urokliwego domku, otulonego drewnem, gdzie schowamy się w ulubionych skarpetkach, za dużych sweterkach i będziemy kocykować przy kominku i pić ciepłe naparki!`,
	},
	modal: {
		imgModal: this.img,
		glance: ['Kaszuby', 'Dworek Krępkowice', 12, 1200],
		plan: [
			{
				'day': 'Piątek',
				'16:00': 'Przyjazd, Spacerki',
				'18:00': 'Yoga łagodna, relaksująca',
				'19:00': 'Wspólna kolacja',
				'21:00': `Pielęgnacja z naturalnymi kosmetykami / sauna / balia, kobiece rozmowy`,
			},
			{
				'day': 'Sobota',
				'08:00': 'Ziołowy napar dla porannych ptaszków',
				'08:30': 'Energetyczna Yoga Slow Flow',
				'09:30': 'Nieśpieszne śniadanko',
				'CZAS WOLNY': '',
				'14:30': 'Yoga łagodna, relaksująca',
				'16:00': 'Aromaterapia (warsztat świec bubble, wosków na bazie olejków + wykład)',
				'19:00': 'Uczta przy kolacji',
				'20:30': 'Yoga + krąg przy kominku, rozmowy',
			},
			{
				'day': 'Niedziela',
				'08:30': 'Ziołowy napar dla porannych ptaszków',
				'09:00': 'Yoga Slow Flow',
				'10:00': 'Nieśpieszne śniadanie',
				'CZAS WOLNY': '',
				'13:00': 'Lunch i pożegnanie',
			},
		],
		included: [
			'4x Yoga (Slow Flow, Hatha, Nidra)',
			'Warsztat świec i wosków',
			'Rytuał Pielęgnacyjny Twarzy',
			'Krąg',
			'Upominek',
			'Pobyt z Wyżywieniem',
			'Kawa / Herbata / Napary 24/h',
		],
		excluded: ['Dojazd', 'Ubezpieczenie'],
		optional: [
			'Masaż Misami Tybetańskimi 120zł',
			'Masaż Kobido 30zł',
			'Sauny i Balii (oferta wkrótce)',
		],
		freeTime: [
			{status: 'free', activity: 'Kocyk, spacerki, naparki'},
			{status: 'optional', activity: 'Masaże misami'},
			{status: 'optional', activity: 'Balia'},
			{status: 'optional', activity: 'Sauna'},
		],
		form: 'https://forms.gle/kYN6VpfP3aV1b9yB8',
		questionTemplate(subject) {
			return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
		},
	},
};
const warmiaCamp = {
	type: `camp`,
	extraClass: 'long',
	img: '../static/img/offer/camp_warmia.png',
	front: {
		frontTitle: `Comfy Retreat
		Yoga | Malowanie Intuicyjne | Gongi
		SPA`,
		frontDate: ['08-11/11/2024'],
		frontLocation: 'Warmia',
		frontDesc: `Otulimy się ciepłym kominkiem, zdrowymi naparami i pysznym jedzeniem! Zabierz swój ulubiony dres, za duży sweterek i ciepłe skarpetki, po prostu Twoje ulubione, jesienne atrybuty!

		Nie zabraknie czasu na książkę pod kocykiem, ale też uziemiających aktywności.`,
	},
	modal: {
		imgModal: 'camp_warmia.jpg',
		glance: ['Warmia', 'Witramowo 32', 18, 1200],
		plan: [
			{
				'day': 'Piątek',
				'16:00': 'Przyjazd, Spacerki',
				'18:00': 'Obiadokolacja',
				'20:00': 'Yoga',
				'21:00': `Kominek/Naparki/Relaks`,
			},
			{
				'day': 'Sobota',
				'08:30': 'Yoga Slow Flow Vinyasa',
				'09:30': 'Nieśpieszne Śniadanko',
				'CZAS WOLNY': '',
				'14:00': 'Obiad + Słodkości',
				'16:00': 'Malowanie intuicyjne przy koncercie mis i gongów',
				'18:30': 'Uczta przy kolacji',
				'20:00': 'Sauna/Balia/Rozmowy/Film',
			},
			{
				'day': 'Niedziela',
				'08:30': 'Yoga Slow Flow Vinyasa',
				'09:30': 'Nieśpieszne Śniadanko',
				'CZAS WOLNY': '',
				'14:00': 'Obiad + Słodkości',
				'17:00': 'Yoga Jin',
				'18:30': 'Kolacja',
				'20:00': 'Rozmowy w Kręgu',
			},
			{
				'day': 'Poniedziałek',
				'08:30': 'Yoga Slow Flow Vinyasa',
				'09:30': 'Nieśpieszne Śniadanko',
				'CZAS WOLNY': '',
				'13:00': 'Lunch i pożegnanie',
			},
		],
		included: [
			'4x Yoga (Slow Flow, Hatha, Nidra)',
			'Warsztat świec i wosków',
			'Rytuał Pielęgnacyjny Twarzy',
			'Krąg',
			'Upominek',
			'Pobyt z Wyżywieniem',
			'Kawa / Herbata / Napary 24/h',
		],
		excluded: ['Dojazd', 'Ubezpieczenie'],
		optional: ['Masaż Misami', 'Sauny i Balii'],
		freeTime: [
			{status: 'free', activity: 'Kocyk, spacerki, naparki'},
			{status: 'optional', activity: 'Masaże Kobido/Misami'},
			{status: 'available', activity: 'Wioska garncarska + Warsztaty'},
		],
		form: 'https://forms.gle/ag6SSBy9zqrxwCRcA',
		questionTemplate(subject) {
			return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
		},
	},
};
// Created active classes so far
const yogaAndSound = {
	type: `event`,
	extraClass: 'event',
	img: '../static/img/offer/events_gongi.png',
	front: {
		frontTitle: `YOGA & SOUND
		Moon Ceremony`,
		frontDate: [`Data wkrótce...`],
		frontLocation: `Plaża Trójmiasto`,
		frontDesc: `Comiesięczne spotkania przy pełni księżyca, gongami wprowadzające Cię w relaksujący trans.
		Więcej...`,
	},
	modal: {
		imgModal: this.img,
		fullDesc: `To comiesięczne spotkania przy pełni księżyca. W okresie letnim wydarzenie jest organizowane na plaży, natomiast w sezonie jesienno-zimowym przenosimy się na przytulne sale na terenie Trójmiasta.`,
		program: [
			`Sesja yogi przy dźwiękach mis i gongów (koncert w wykonaniu Agnieszki Topp)`,
			`Savanasa z opaską na oczach nasączona aromatycznymi olejkami`,
			`Zdrowy napar naszego przepisu`,
			`Rozmowy w kręgu`,
			`Upominek naszego autorstwa`,
			`Maty od partnera Miś Yoga`,
		],
		form: 'https://forms.gle/kYN6VpfP3aV1b9yB8',
		questionTemplate(subject) {
			return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
		},
	},
};
const yogaNaSupach = {
	type: `event`,
	extraClass: 'event',
	img: '../static/img/offer/offer_sup.png',
	front: {
		frontTitle: `Yoga na Supach`,
		frontDate: [`(Sezon Letni)`],
		frontLocation: `Plaża Trójmiasto`,
		frontDesc: `Nie bój się zmoczyć... Extra mobilizacja mięśni głębokich i stabilizujących
		Więcej...`,
	},
	modal: {
		imgModal: this.img,
		fullDesc: `Latem zapraszam do wodnego studio jogi. Otwarta przestrzeń z  nieskończonym oknem na naturę stanowi doskonałą propozycję na ciepłe dni. Deska SUP zamiast maty, promienie słońca, letni podmuch wiatru i szum drzew dodadzą Twojej praktyce lekkości. Poprawisz balans, wzmocnisz mięśnie posturalne, zrelaksujesz się czując delikatne muskanie fal. Zobacz fotorelację z sezonu 2023 oraz 2024. Zajęcia odbywały się na jeziorze oraz w Zatoce Gdańskiej (Brzeźno).`,
		form: 'https://forms.gle/kYN6VpfP3aV1b9yB8',
		questionTemplate(subject) {
			return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
		},
	},
};

// class tile template
class Tile {
	scrollFlag = 1;

	// constructor destructuring template camp offer
	constructor(givenEventBody) {
		this.type = givenEventBody.type;
		this.extraClass = givenEventBody.extraClass;
		this.img = givenEventBody.img;
		this.frontTitle = givenEventBody.front.frontTitle;
		this.frontDate = givenEventBody.front.frontDate;
		this.frontLocation = givenEventBody.front.frontLocation;
		this.frontDesc = givenEventBody.front.frontDesc;
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
	showModal = (modal) => {
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
	closeModal = (modal) => {
		// remove classlist from modal
		modal.classList.remove('visible');
		// "give status" to Dom to not scroll the entire page
		this.hamburger.classList.remove('hidden');
		this.body.classList.remove('stopScroll');
		// allow scroll - update status
		this.scrollFlag = 1;
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
			tile.classList.add(this.extraClass);
		}
		const img = this.createEl('img', {
			class: 'tile__img pic',
			src: `${this.img}`,
			loading: 'lazy',
		});

		const frontTitle = this.createEl('h3');
		frontTitle.innerText = this.frontTitle;
		const frontDates = [];
		this.frontDate.forEach((el) => {
			const frontDate = this.createEl('h3');
			frontDate.innerText = el;
			frontDates.push(frontDate);
		});
		const frontLocation = this.createEl('h4');
		frontLocation.innerText = this.frontLocation;
		const frontDesc = this.createEl('p', {class: 'tile_desc'});
		frontDesc.innerText = this.frontDesc;

		// Append those tags
		appendEl(tile, img, frontTitle, ...frontDates, frontLocation, frontDesc);

		// Add modal if exists
		if (this.modal) {
			// create its main container
			const modal = this.createEl('div', {class: 'modal'});
			// create its close btn
			const X = this.createEl('div', {class: 'x'});
			const Xa = this.createEl('a', {class: 'btn_close'});
			const Xai = this.createEl('i', {class: 'fa-solid fa-xmark'});
			Xa.appendChild(Xai);
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
			document.body.appendChild(modal);

			// add listeners for opening and closing
			tile.addEventListener('click', (e) => {
				e.stopPropagation();
				this.showModal(modal);
			});
			X.addEventListener('click', (e) => {
				e.stopPropagation();
				this.closeModal(modal);
			});
		}

		// Return complete tile
		return tile;
	};
	// util function for modal body to simplify the code. Generates small sections with lists on the bottom
	tileModalChecklistClassic = (type, title, icon, listClass) => {
		// create list general container
		const section = this.createEl('section', {class: listClass});
		// create list general container header
		const sectionHeader = this.createEl('h3', {class: 'modal_h3'});
		sectionHeader.innerText = title;
		section.appendChild(sectionHeader);
		// create list container
		const sectionList = this.createEl('ul', {class: 'modal_list'});
		// create list items
		this.modal[type].forEach((item) => {
			// create li
			const li = this.createEl('li', {class: 'modal_li'});
			// assign icon parameter
			let iconClass = icon;
			// check if iterates after simple array or array of objects which is for //#Free-Time only
			if (item.status != undefined) {
				// if first item isn't free which means its icon is different than standard default one
				if (item.status != 'free') {
					iconClass =
						item.status == 'optional'
							? 'fa-solid fa-plus'
							: 'fa-regular fa-hand-point-right';
				}
				// create chosen icon
				const chosenIcon = this.createEl('i', {class: iconClass});
				// append it
				li.append(chosenIcon, item.activity);
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
			class: `modal_offer `,
		});
		//@ img
		// create img
		const img = this.createEl('img', {
			class: 'tile__img pic',
			src: `${this.img}`,
			loading: 'lazy',
		});
		modalOffer.appendChild(img);

		//@ header
		const header = this.createEl('header');
		const ul = this.createEl('div', {class: 'modal_list at-glance'});
		// point list of icons to include in order
		const icons = [
			'fa-solid fa-location-dot',
			'fa-solid fa-bed',
			'fa-solid fa-people-group',
			'fa-solid fa-tag',
		];
		// iterate after modal's "at glance" part
		this.modal.glance.forEach((text, index) => {
			// create li
			const li = this.createEl('li', {class: 'modal_li modal_answer'});
			// create icon choosing the right one in order
			const icon = this.createEl('i', {
				class: icons[index] ? icons[index] : 'fa-solid fa-check',
			});
			// append icon + text from glance array
			li.append(icon, text);
			// append li
			ul.appendChild(li);
		});
		// append list in header
		header.appendChild(ul);
		// append complete header
		modalOffer.appendChild(header);

		// create modal plan for camp
		//@ section modal_desc
		// create main container
		const sectionDesc = this.createEl('section', {
			class: `modal_desc ${this.extraClass ? this.extraClass : ''}`,
		});
		// create header container h3
		const sectionDescHeader = this.createEl('h3', {class: 'modal_h3'});
		// create icon
		const sectionDescHeaderI = this.createEl('i', {class: 'fa-solid fa-list-check'});
		// populate header with icon and text
		sectionDescHeader.append(sectionDescHeaderI, 'Plan:');
		// append ready section header
		sectionDesc.appendChild(sectionDescHeader);
		// iterate after array of days objects
		this.modal.plan.forEach((campDay) => {
			// create days header
			const dayHeader = this.createEl('h4');
			dayHeader.innerText = campDay.day + ':';
			// create container for day's list of activities
			const dayPlan = this.createEl('ul', {class: 'modal_list'});
			// get day object keys
			const keys = Object.keys(campDay);
			// start from 2nd one to avoid days name
			for (let i = 1; i < keys.length; i++) {
				const time = keys[i];
				const timeContainer = this.createEl('div');
				timeContainer.innerText = time;
				const activity = campDay[time];
				const li = this.createEl('li', {class: 'modal_li'});
				li.append(timeContainer, activity);
				dayPlan.appendChild(li);
			}
			sectionDesc.append(dayHeader, dayPlan);
		});
		modalOffer.appendChild(sectionDesc);

		//@ section modal_included
		// create section for what's included using util function and custom parameters
		const sectionIncluded = this.tileModalChecklistClassic(
			'included',
			'W cenie:',
			'fa-solid fa-check',
			'modal_included',
		);
		modalOffer.appendChild(sectionIncluded);
		//@ section modal_excluded
		// create section for what's excluded
		const sectionExcluded = this.tileModalChecklistClassic(
			'excluded',
			'We własnym zakresie:',
			'fa-regular fa-hand-point-right',
			'modal_excluded',
		);
		modalOffer.appendChild(sectionExcluded);
		//@ section modal_optional
		// create section for what's optional to buy
		const sectionOptional = this.tileModalChecklistClassic(
			'optional',
			'Opcje:',
			'fa-solid fa-plus',
			'modal_optional',
		);
		modalOffer.appendChild(sectionOptional);
		//@ section modal_free-time
		// create section for what's possible to do in free time
		const sectionFreeTime = this.tileModalChecklistClassic(
			'freeTime',
			'W Czasie Wolnym:',
			'fa-solid fa-check',
			'modal_free-time',
		);
		modalOffer.appendChild(sectionFreeTime);
		//@ attention
		// create a footer with 2 buttons to cause and action
		// @ footer modal_user-action
		const attentionNote = this.createEl('h2', {
			class: 'modal_attention-note',
		});
		attentionNote.innerText =
			'Miejsce gwarantowane jest wpłatą bezzwrotnego zadatku w kwocie 500 zł';
		modalOffer.appendChild(attentionNote);
		// create a footer with 2 buttons to cause and action
		// @ footer modal_user-action
		const footer = this.createEl('footer', {
			class: 'modal_user-action',
		});
		// use address  from camps dataset
		const footerBtnSignUp = this.createEl('a', {
			href: this.modal.form,
			class: 'btn_sign-up',
			target: '_blank',
		});
		// use message from camps dataset
		footerBtnSignUp.innerText = 'Zapisz się';
		const footerBtnAsk = this.createEl('a', {
			href: `https://wa.me/${48792891607}?text=${encodeURIComponent(
				this.modal.questionTemplate(this.frontTitle),
			)}`,
			class: 'btn_ask-for-info',
			target: '_blank',
		});
		footerBtnAsk.innerText = 'Zapytaj';
		footer.append(footerBtnSignUp, footerBtnAsk);
		modalOffer.appendChild(footer);

		// return complete modal body
		return modalOffer;
	};
	generateTileModalEvent = () => {
		// create main container
		const modalOffer = this.createEl('div', {
			class: `modal_offer ${this.extraClass}`,
		});
		//@ img
		// create img
		const img = this.createEl('img', {
			class: 'tile__img pic',
			src: `${this.img}`,
			loading: 'lazy',
		});
		modalOffer.appendChild(img);

		//@ header
		// create modal plan for camp
		//@ section modal_desc
		// create main container
		const sectionDesc = this.createEl('section', {
			class: `modal_desc--event ${this.extraClass ? this.extraClass : ''}`,
		});
		// create header container h3
		const sectionDescHeader = this.createEl('h3', {class: 'modal_h3'});
		// create icon
		// const sectionDescHeaderI = this.createEl('i', {class: 'fa-solid fa-list-check'});
		// populate header with icon and text
		sectionDescHeader.append('W skrócie:');
		// append ready section header
		sectionDesc.appendChild(sectionDescHeader);
		sectionDesc.append(this.modal.fullDesc);
		modalOffer.appendChild(sectionDesc);

		//@ section modal_included
		// create section for what's included using util function and custom parameters
		if (this.modal.program) {
			const sectionIncluded = this.tileModalChecklistClassic(
				'program',
				'W programie:',
				'fa-solid fa-check',
				'modal_included',
			);
			modalOffer.appendChild(sectionIncluded);
		}
		// create a footer with 2 buttons to cause and action
		// @ footer modal_user-action
		const footer = this.createEl('footer', {
			class: 'modal_user-action',
		});
		// use address  from camps dataset
		const footerBtnSignUp = this.createEl('a', {
			href: this.modal.form,
			class: 'btn_sign-up',
			target: '_blank',
		});
		// use message from camps dataset
		footerBtnSignUp.innerText = 'Zapisz się';
		const footerBtnAsk = this.createEl('a', {
			href: `https://wa.me/${48792891607}?text=${encodeURIComponent(
				this.modal.questionTemplate(this.frontTitle),
			)}`,
			class: 'btn_ask-for-info',
			target: '_blank',
		});
		footerBtnAsk.innerText = 'Zapytaj';
		footer.append(footerBtnSignUp, footerBtnAsk);
		modalOffer.appendChild(footer);

		// return complete modal body
		return modalOffer;
	};
	generateSlider = (relativePath, imgArray) => {
		const glide = this.createEl('div', {class: 'glide'});
		const glideTrack = this.createEl('div', {'class': 'glide_track', 'data-glide-el': 'track'});
		const glideSlides = this.createEl('ul', {
			'class': 'glide__slides',
			'data-glide-el': 'track',
		});
		const screenWidth = window.innerWidth;
		let resolution;
		// Użycie switch do obsługi różnych zakresów rozdzielczości
		switch (true) {
			case screenWidth <= 480:
				resolution = 480;
				break;
			case screenWidth > 480 && screenWidth <= 768:
				resolution = 768;

				break;
			case screenWidth > 768 && screenWidth <= 1024:
				resolution = 1024;
				break;
			case screenWidth > 1024 && screenWidth <= 1280:
				resolution = 1200;
				break;
			case screenWidth > 1280:
				resolution = 1600;
				break;
			default:
				console.log('Nieznana rozdzielczość');
				break;
		}
		imgArray.forEach((imgName) => {
			const glideSlideLi = this.createEl('li', {class: 'glide__slide'});
			const image = this.createEl('img', {
				class: 'tile__img certificates__pic',
				src: `${relativePath}/${imgName}_${resolution}`,
				loading: 'lazy',
			});
			glideSlideLi.appendChild(image);
			glideSlides.appendChild(glideSlideLi);
		});
		glideTrack.appendChild(glideSlides);

		const glideBullets = this.createEl('div', {
			'class': 'glide__bullets',
			'data-glide-el': 'controls[nav]',
		});
		for (let i = 0; i < imgArray.length; i++) {
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
			class: 'fa-solid fa-chevron-left',
		});
		glideArrowRight.appendChild(iconArrowRight);
		glideArrows.append(glideArrowLeft, glideArrowRight);
		glide.appendChild(glideArrows);
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

	// cookies
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
		perView: 3,
		focusAt: 'center',
		gap: 20,
		// autoplay: 2200,
		animationDuration: 800,
	});

	glide.on('run', () => {
		const activeElement = document.querySelector('.glide__slide--active');
	});

	glide.mount();
});
