// Created camps so far
const kaszubyCamp = {
	extraClass: '',
	img: 'camp_kaszuby.jpg',
	front: {
		frontTitle: `Kojenie Zmysłów - joga, aromaterapia i spa`,
		frontDate: `11-13/10/2024`,
		frontLocation: `Kaszuby`,
		frontDesc: `Zabieram Cię do urokliwego domku, otulonego drewnem, gdzie schowamy się	w ulubionych skarpetkach, za dużych sweterkach i będziemy kocykować przy kominku i pić ciepłe naparki!`,
	},
	modal: {
		imgModal: this.img,
		glance: ['Kaszuby', 'Dworek Krępkowice', 12, 1200],
		plan: [
			{
				'day': 'Piątek',
				'16:00': 'Przyjazd, Spacerki',
				'18:00': 'Joga łagodna, relaksująca',
				'19:00': 'Wspólna kolacja',
				'21:00': `Pielęgnacja z naturalnymi kosmetykami / sauna / balia, kobiece rozmowy`,
			},
			{
				'day': 'Sobota',
				'08:30': 'Przyjazd, Spacerki',
				'09:30': 'Joga łagodna, relaksująca',
				'CZAS WOLNY': '',
				'16:00': 'aromaterapia (warsztat świec bubble, wosków na bazie olejków + wykład)',
				'19:00': 'Uczta przy kolacji',
				'20:30': 'Joga + krąg przy kominku, rozmowy',
			},
			{
				'day': 'Niedziela',
				'08:30': 'Ziołowy napar dla porannych ptaszków',
				'09:00': 'Joga Slow Flow',
				'10:00': 'Nieśpieszne śniadanie',
				'CZAS WOLNY': '',
				'13:00': 'Lunch i pożegnanie',
			},
		],
		included: [
			'4x Joga (Slow Flow, Hatha, Nidra)',
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
	extraClass: 'long',
	img: 'camp_warmia.jpg',
	front: {
		frontTitle: 'Comfy Retreat - joga, malowanie intuicyjne, gongi i spa',
		frontDate: '08-11/11/2024',
		frontLocation: 'Warmia',
		frontDesc:
			'Otulimy się ciepłym kominkiem, zdrowymi naparami i pysznym jedzeniem! Zabierz swój ulubiony dres, za duży sweterek i ciepłe skarpetki, po prostu Twoje ulubione jesienne atrybuty! Nie zabraknie czasu na książkę pod kocykiem, ale też uziemiających aktywności.',
	},
	modal: {
		imgModal: 'camp_warmia.jpg',
		glance: ['Warmia', 'Witramowo 32', 18, 1200],
		plan: [
			{
				'day': 'Piątek',
				'16:00': 'Przyjazd, Spacerki',
				'18:00': 'Obiadokolacja',
				'20:00': 'Joga',
				'21:00': `Kominek/Naparki/Relaks`,
			},
			{
				'day': 'Sobota',
				'08:30': 'Joga Slow Flow Vinyasa',
				'09:30': 'Nieśpieszne Śniadanko',
				'CZAS WOLNY': '',
				'14:00': 'Obiad + Słodkości',
				'16:00': 'Malowanie intuicyjne przy koncercie mis i gongów',
				'18:30': 'Uczta przy kolacji',
				'20:00': 'Sauna/Balia/Rozmowy/Film',
			},
			{
				'day': 'Niedziela',
				'08:30': 'Joga Slow Flow Vinyasa',
				'09:30': 'Nieśpieszne Śniadanko',
				'CZAS WOLNY': '',
				'14:00': 'Obiad + Słodkości',
				'17:00': 'Joga Jin',
				'18:30': 'Kolacja',
				'20:00': 'Rozmowy w Kręgu',
			},
			{
				'day': 'Poniedziałek',
				'08:30': 'Joga Slow Flow Vinyasa',
				'09:30': 'Nieśpieszne Śniadanko',
				'CZAS WOLNY': '',
				'13:00': 'Lunch i pożegnanie',
			},
		],
		included: [
			'4x Joga (Slow Flow, Hatha, Nidra)',
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
// class tile template
class Tile {
	scrollFlag = 1;

	// constructor destructuring template camp offer
	constructor(givenEventBody) {
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
		// Create separate tags
		const tile = this.createEl('div', {class: 'tile camp'});
		// If for example "long" class required what triggers different grid layout
		if (this.extraClass) {
			tile.classList.add(this.extraClass);
		}
		const img = this.createEl('img', {
			class: 'pic',
			src: `../static/img/offer/${this.img}`,
			loading: 'lazy',
		});
		const frontTitle = this.createEl('h3');
		frontTitle.innerText = this.frontTitle;
		const frontDate = this.createEl('h3');
		frontDate.innerText = this.frontDate;
		const frontLocation = this.createEl('h4');
		frontLocation.innerText = this.frontLocation;
		const frontDesc = this.createEl('p', {class: 'tile_desc'});
		frontDesc.innerText = this.frontDesc;

		// Append those tags
		tile.append(img, frontTitle, frontDate, frontLocation, frontDesc);

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

			// call to build main modal body
			const modalBody = this.generateTileModal();
			modal.appendChild(modalBody);
			tile.appendChild(modal);

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
	generateTileModal = () => {
		// create main container
		const modalOffer = this.createEl('div', {class: 'modal_offer'});
		//@ img
		// create img
		const img = this.createEl('img', {
			class: 'pic',
			src: `../static/img/offer/${this.img}`,
			loading: 'lazy',
		});
		modalOffer.appendChild(img);

		// create header
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
		const sectionDesc = this.createEl('section', {class: 'modal_desc'});
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
				const activity = campDay[time];
				const li = this.createEl('li', {class: 'modal_li'});
				li.append(`${time} - ${activity}`);
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
			'W cenie',
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
}

// list of active camps to sign for
const activeCamps = [kaszubyCamp, warmiaCamp];

// do when DOM loaded
document.addEventListener('DOMContentLoaded', function () {
	const menuLinks = document.querySelectorAll('ul li a');
	const hamburger = document.getElementById('burger');
	const wyjazdy = document.querySelector('#wyjazdy');

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

	// cookies x btn

	document.querySelector('.cookie-x').addEventListener('click', (e) => {
		const parent = e.target.closest('.pop-up-btn.cookies');
		parent.style.display = 'none';
		console.log(parent);
	});
});
