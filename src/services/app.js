document.addEventListener('DOMContentLoaded', function () {
	const body = document.body;
	const menuLinks = document.querySelectorAll('ul li a');
	const hamburger = document.getElementById('burger');
	const campTiles = document.querySelectorAll('.tile.camp');

	// functions
	const toggleMenu = () => {
		hamburger.classList.toggle('active');
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

		// document.getElementById('whatsapp-kaszuby').href = linkKaszuby;
		// document.getElementById('whatsapp-warmia').href = linkWarmia;
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
	whatsappTemplates();

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
	class Tile {
		scrollFlag = 0;
		constructor(givenEventBody) {
			this.extraClass = givenEventBody.extraClass;
			this.img = givenEventBody.img;
			this.frontTitle = givenEventBody.front.frontTitle;
			this.frontDate = givenEventBody.front.frontDate;
			this.frontLocation = givenEventBody.front.frontLocation;
			this.frontDesc = givenEventBody.front.frontDesc;
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
		showModal = (event) => {
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
		closeModal = (event) => {
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
		generateTile = () => {
			// Create separate tags
			const tile = this.createEl('div', {class: 'tile camp'});
			tile.addEventListener('click', this.showModal);
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
				const modal = this.createEl('div', {class: 'modal'});
				const X = this.createEl('div', {class: 'x'});
				X.addEventListener('click', this.closeModal);
				const Xa = this.createEl('a', {class: 'btn_close'});
				const Xai = this.createEl('i', {class: 'fa-solid fa-xmark'});
				Xa.appendChild(Xai);
				X.appendChild(Xa);
				modal.appendChild(X);
				const modalBody = this.generateTileModal();
				modal.appendChild(modalBody);
				tile.appendChild(modal);
			}

			// Return complete tile
			return tile;
		};
		tileModalChecklistClassic = (type, title, icon, listClass) => {
			// create list general container
			const sectionIncluded = this.createEl('section', {class: listClass});
			// create list general container header
			const sectionIncludedHeader = this.createEl('h3', {class: 'modal_h3'});
			sectionIncludedHeader.innerText = title;
			sectionIncluded.appendChild(sectionIncludedHeader);
			// create list container
			const sectionIncludedList = this.createEl('ul', {class: 'modal_list'});
			// create list items
			this.modal[type].forEach((item) => {
				const li = this.createEl('li', {class: 'modal_li'});
				const includedIcon = this.createEl('i', {class: icon});
				li.append(includedIcon, item);
				sectionIncludedList.appendChild(li);
			});
			sectionIncluded.appendChild(sectionIncludedList);
			return sectionIncluded;
		};
		generateTileModal = () => {
			const modalOffer = this.createEl('div', {class: 'modal_offer'});
			//@ img
			const img = this.createEl('img', {
				class: 'pic',
				src: `../static/img/offer/${this.img}`,
				loading: 'lazy',
			});
			modalOffer.appendChild(img);

			//@ header
			const header = this.createEl('header');
			const ul = this.createEl('div', {class: 'modal_list at-glance'});
			const icons = [
				'fa-solid fa-location-dot',
				'fa-solid fa-bed',
				'fa-solid fa-people-group',
				'fa-solid fa-tag',
			];
			this.modal.glance.forEach((text, index) => {
				const li = this.createEl('li', {class: 'modal_li modal_answer'});
				const icon = this.createEl('i', {
					class: icons[index] ? icons[index] : 'fa-solid fa-check',
				});
				li.append(icon, text);
				ul.appendChild(li);
			});
			header.appendChild(ul);
			modalOffer.appendChild(header);

			//@ section modal_desc
			const sectionDesc = this.createEl('section', {class: 'modal_desc'});
			const sectionDescHeader = this.createEl('h3', {class: 'modal_h3'});
			const sectionDescHeaderI = this.createEl('i', {class: 'fa-solid fa-list-check'});
			sectionDescHeader.append(sectionDescHeaderI, 'Plan:');
			sectionDesc.appendChild(sectionDescHeader);

			this.modal.plan.forEach((campDay) => {
				const dayHeader = this.createEl('h4');
				dayHeader.innerText = campDay.day + ':';
				const dayPlan = this.createEl('ul', {class: 'modal_list'});
				// get day keys
				const keys = Object.keys(campDay);
				// start from 2nd
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
			const sectionIncluded = this.tileModalChecklistClassic(
				'included',
				'W cenie:',
				'fa-solid fa-check',
				'modal_included',
			);
			modalOffer.appendChild(sectionIncluded);
			//@ section modal_excluded
			const sectionExcluded = this.tileModalChecklistClassic(
				'excluded',
				'We własnym zakresie:',
				'fa-regular fa-hand-point-right',
				'modal_excluded',
			);
			modalOffer.appendChild(sectionExcluded);
			//@ section modal_optional
			const sectionOptional = this.tileModalChecklistClassic(
				'optional',
				'W cenie',
				'fa-solid fa-plus',
				'modal_optional',
			);
			modalOffer.appendChild(sectionOptional);

			//@ section modal_free-time
			// create list general container
			const sectionFreeTime = this.createEl('section', {class: 'modal_free-time'});
			// create list general container header
			const sectionFreeTimeHeader = this.createEl('h3', {class: 'modal_h3'});
			sectionFreeTimeHeader.innerText = 'Czas wolny:';
			sectionFreeTime.appendChild(sectionFreeTimeHeader);
			// create list container
			const sectionFreeTimeList = this.createEl('ul', {class: 'modal_list'});
			// create list items
			const freeTimeList = this.modal.freeTime;
			freeTimeList.forEach((item) => {
				const li = this.createEl('li', {class: 'modal_li'});
				let iconClass = 'fa-solid fa-check';
				if (item.status != 'free') {
					iconClass =
						item.status == 'optional'
							? 'fa-solid fa-plus'
							: 'fa-regular fa-hand-point-right';
				}
				const icon = this.createEl('i', {class: iconClass});
				li.append(icon, item.activity);
				sectionFreeTimeList.appendChild(li);
			});
			sectionFreeTime.append(sectionFreeTimeList);
			modalOffer.appendChild(sectionFreeTime);

			// @ footer modal_user-action
			const footer = this.createEl('footer', {
				class: 'modal_user-action',
			});
			const footerBtnSignUp = this.createEl('a', {
				href: this.modal.form,
				class: 'btn_sign-up',
				target: '_blank',
			});
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
			return modalOffer;
		};
	}

	const kaszubyTile = new Tile(kaszubyCamp);
	const warmiaTile = new Tile(warmiaCamp);
	const wyjazdy = document.querySelector('#wyjazdy');
	wyjazdy.appendChild(kaszubyTile.generateTile());
	wyjazdy.appendChild(warmiaTile.generateTile());
});
