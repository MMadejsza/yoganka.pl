document.addEventListener('DOMContentLoaded', function () {
	const body = document.body;
	const menuLinks = document.querySelectorAll('ul li a');
	const hamburger = document.getElementById('burger');
	const campTiles = document.querySelectorAll('.tile.camp');

	// functions
	const toggleMenu = () => {
		hamburger.classList.toggle('active');
	};
	let scrollFlag = 0;
	const showModal = (event) => {
		event.stopPropagation();
		const tile = event.currentTarget;
		const targetModal = tile.querySelector('.modal');
		if (targetModal) {
			body.classList.add('stopScroll');
			targetModal.classList.add('visible');
			hamburger.classList.add('hidden');
			if (scrollFlag) {
				targetModal.scrollTop = 0;
			}
			scrollFlag = 0;
		}
	};
	const closeModal = (event) => {
		event.stopPropagation(); // Zapobiega zamknięciu modala przez kliknięcie elementu `.tile.camp`
		const btn = event.currentTarget;
		const modal = btn.closest('.modal');
		if (modal) {
			modal.classList.remove('visible');
			hamburger.classList.remove('hidden');
			body.classList.remove('stopScroll');
			scrollFlag = 1;
		}
	};
	const whatsappTemplates = () => {
		const enter = '%0A';
		const phoneNumber = '48792891607';
		const msgKaszuby = `Hej! Mam pytanie odnośnie wyjazdu na Kaszuby w październiku :)\n\nTu [imię] [Nazwisko]`;
		const msgWarmia = `Hej! Mam pytanie odnośnie wyjazdu na Warmię w listopadzie :)\n\nTu [imię] [Nazwisko]`;
		const msgContact = `Hej! Piszę do Ciebie z yoganka.pl :)\n\nTu [imię] [Nazwisko]`;

		const linkKaszuby = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msgKaszuby)}`;
		const linkWarmia = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msgWarmia)}`;
		const linkContact = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msgContact)}`;

		document.getElementById('whatsapp-kaszuby').href = linkKaszuby;
		document.getElementById('whatsapp-warmia').href = linkWarmia;
		document.getElementById('whatsapp-contact').href = linkContact;
	};

	// application
	hamburger.addEventListener('click', () => toggleMenu());
	menuLinks.forEach((link) => {
		link.addEventListener('click', (event) => {
			// Pobierz atrybut href z klikniętego linku
			const targetSelector = link.getAttribute('href');

			// Znajdź pierwszy element z klasą odpowiadającą href
			const targetSection = document.querySelector(targetSelector);

			// Jeśli sekcja istnieje, przewiń do niej
			if (targetSection) {
				event.preventDefault(); // Zatrzymaj domyślne przewijanie
				toggleMenu();
				targetSection.scrollIntoView({behavior: 'smooth'});
			}
		});
	});
	campTiles.forEach((camp) => {
		camp.addEventListener('click', showModal);
		const closeButton = camp.querySelector('.btn_close');
		if (closeButton) {
			closeButton.addEventListener('click', closeModal);
		}
	});
	whatsappTemplates();

	const kaszubyCamp = {
		extraClass: '',
		img: 'camp_kaszuby.jpg',
		frontTitle: `Kojenie Zmysłów - joga, aromaterapia i spa`,
		frontDate: `11-13/10/2024`,
		frontLocation: `Kaszuby`,
		frontDesc: `Zabieram Cię do urokliwego domku, otulonego drewnem, gdzie schowamy się	w ulubionych skarpetkach, za dużych sweterkach i będziemy kocykować przy kominku i pić ciepłe naparki!`,
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
					'16:00':
						'aromaterapia (warsztat świec bubble, wosków na bazie olejków + wykład)',
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
			questionTemplate: `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${this.frontTitle}"\n\nTu [imię] [Nazwisko]`,
		},
	};
	const warmiaCamp = {
		extraClass: 'long',
		img: 'camp_warmia.jpg',
		frontTitle: 'Comfy Retreat - joga, malowanie intuicyjne, gongi i spa',
		frontDate: '08-11/11/2024',
		frontLocation: 'Warmia',
		frontDesc:
			'Otulimy się ciepłym kominkiem, zdrowymi naparami i pysznym jedzeniem! Zabierz swój ulubiony dres, za duży sweterek i ciepłe skarpetki, po prostu Twoje ulubione jesienne atrybuty! Nie zabraknie czasu na książkę pod kocykiem, ale też uziemiających aktywności.',
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
			questionTemplate: `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${this.frontTitle}"\n\nTu [imię] [Nazwisko]`,
		},
	};
	class tile {
		constructor(givenEventBody) {
			this.extraClass = givenEventBody.extraClass;
			this.img = givenEventBody.img;
			this.frontTitle = givenEventBody.frontTitle;
			this.frontDate = givenEventBody.frontDate;
			this.frontLocation = givenEventBody.frontLocation;
			this.frontDesc = givenEventBody.frontDesc;
			this.modal = givenEventBody.modal;
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

		generateTile = () => {
			const tile = createEl('div', {class: 'tile, camp'});
			const img = createEl('img', {
				class: 'pic',
				src: `../static/img/offer/${this.img}`,
				loading: 'lazy',
			});
			const frontTitle = createEl('h3');
			frontTitle.inneText = this.frontTitle;
			const frontDate = createEl('h3');
			frontDate.inneText = this.frontDate;
			const frontLocation = createEl('h4');
			frontLocation.inneText = this.frontLocation;
			const frontDesc = createEl('p', {class: 'tile_desc'});
			frontDesc.inneText = this.frontDesc;
			const modal = createEl('div', {class: 'modal'});
			const modalBody = generateTileModal();

			// składaj od tyłu

			return tile;
		};
		generateTileModal = () => {};
	}
});
