// Import of style moved to index.js due to troubles with proper vite bundling
import '../../node_modules/@glidejs/glide/dist/css/glide.core.min.css';
import '../../node_modules/@glidejs/glide/dist/css/glide.theme.min.css';
import Glide from '@glidejs/glide';
import '/src/styles/main.scss';

// Get todays date
const todayRaw = new Date();
const today = todayRaw.toISOString().split('T')[0]; // "YYYY-MM-DD"
const htmlToImgsPath = '/imgs';

// Created camps so far
const kaszubyCamp = {
	type: `camp`,
	extraClass: '',
	imgPath: `${htmlToImgsPath}/offer/camps/camp_kaszuby/front`,
	galleryPath: `${htmlToImgsPath}/offer/camps/camp_kaszuby/gallery`,
	gallerySize: 12,
	fileName: `camp_kaszuby`,
	date: '2024-10-11',
	front: {
		nazwaWyjazdu: `Kojenie Zmysłów
	   Joga | Aromaterapia | SPA | SkinCare`,
		listaDat: [`11-13/10/2024`],
		rejon: `Kaszuby`,
	},
	modal: {
		// imgModal: this.imgPath,
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
	imgPath: `${htmlToImgsPath}/offer/camps/camp_warmia/front`,
	galleryPath: `${htmlToImgsPath}/offer/camps/camp_warmia/gallery`,
	gallerySize: 12,
	fileName: `camp_warmia`,
	date: '2024-11-08',
	front: {
		nazwaWyjazdu: `Comfy slow weekend
	   Joga | Malowanie | SPA | Misy\u00A0i\u00A0gongi`,
		listaDat: [`08-11.11.2024`],
		rejon: `Warmia`,
	},

	modal: {
		// imgModal: this.imgPath,
		opis: `Siostrzana energia, otulający zapach jesieni, atmosfera zrozumienia. Ten retreat to coś więcej niż odpoczynek, to 4-dniowa podróż do siebie. Jeśli marzysz o takim wyjeździe, ale nie masz z kim pojechać, to chcę Cię uspokoić, że poznasz na miejscu fantastyczne kobiety. Oferuję szeroki wachlarz wspólnych zajęć.`,
		krotkieInfo: {
			naglowek: '',
			nocleg: 'Witramowo 32',
			// liczbaMiejsc: '',
			cena: '1550zł',
			// dojazd: 'we własnym zakresie',
		},
		plan: {
			naglowek: 'Slow menu:',
			tresc: [
				{
					'naglowekDnia': 'Piątek:',
					'16:00': 'Zakwaterowanie',
					'18:00': 'Joga Yin',
					'19:00': 'Kolacja',
					'21:00': `Ciepła balia pod gwiazdami`,
				},
				{
					'naglowekDnia': 'Sobota:',
					'08:30': 'Joga Slow Flow',
					'09:30': 'Niespieszne śniadanie',
					'CZAS WOLNY': '',
					'14:00': 'Obiad + słodki poczęstunek',
					'16:00': 'Malowanie intuicyjne przy dźwiękach mis i gongów',
					'18:30': 'Uczta przy kolacji',
					'20:00': 'Rozmowy przy kominku/pogaduchy/film',
				},
				{
					'naglowekDnia': 'Niedziela:',
					'08:30': `Joga energetyczna slow flow`,
					'09:30': 'Niespieszne śniadanie',
					'CZAS WOLNY': '',
					'14:30': 'Obiad i słodki poczęstunek',
					'17:00': 'Joga yin',
					'18:30': 'Kolacja',
					'20:00': 'Rozmowy w kręgu z użyciem kart rozwojowych',
				},
				{
					'naglowekDnia': 'Poniedziałek:',
					'08:30': `Joga Slow Flow`,
					'09:30': 'Niespieszne śniadanie',
					'CZAS WOLNY': '',
					'13:00': 'Lunch i powrót do domu',
				},
			],
		},

		wCenie: {
			naglowek: 'W Cenie:',
			tresc: [
				'6 praktyk jogi',
				'Malowanie intuicyjne',
				'Koncert mis i gongów',
				'Balia',
				'Pobyt z Wyżywieniem',
				'Kawa / Herbata / Napary 24/h',
			],
		},

		extraPlatneOpcje: {
			naglowek: 'Poszerz Slow Menu:',
			tresc: [
				'Masaż Kobido 30zł/30min',
				'Masaż Misami Tybetańskimi 120 zł/45min',
				'Sauna (jeszcze w budowie)',
			],
		},
		czasWolny: {
			naglowek: 'W Czasie Wolnym:',
			//(notka: statusy to free/optional/available o różnych ikonach)
			tresc: [
				{status: 'free', aktywnosc: 'Kocyk, leśne spacery, pogaduchy, zdrowe napary'},
				{status: 'optional', aktywnosc: 'Masaż Misami oraz Kobido'},
				{status: 'optional', aktywnosc: 'Sauna'},
			],
		},
		uwaga: `Zaserwuj sobie spokój i zdrowszą siebie.`,
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
	imgPath: `${htmlToImgsPath}/offer/events/yoga&sound/front`,
	galleryPath: `${htmlToImgsPath}/offer/events/yoga&sound/front`,
	fileName: `ys`,
	date: '2025-05-21',
	eventType: 'fixed',
	front: {
		nazwaWyjazdu: `YOGA\u00A0&\u00A0SOUND
		Moon\u00A0Ceremony`,
		listaDat: [`Latem`],
		rejon: `Plaże w Gdańsku`,
		krotkiOpis: `Joga na\u00A0plaży przy pełni księżyca z\u00A0dźwiękami mis i\u00A0gongów w\u00A0tle, które wprowadzą Cię w\u00A0relaksującą podróż.`,
	},
	modal: {
		// imgModal: this.imgPath,
		tytulOpisu: 'O spotkaniu:',
		pelnyOpis: `Takiego wydarzenia w\u00A0Trójmieście nie\u00A0było. Dźwięki mis\u00A0i\u00A0gongów tworzą kojącą atmosferę, pomagając w\u00A0głębszym relaksie i medytacji. Pod rozgwieżdżonym niebem, wśród szumu fal, każda asana staje się bardziej intymna i\u00A0energetyzująca. Bliskość natury i\u00A0moc pełni księżyca dodają praktyce niezwykłej mocy uzdrawiającej. To idealna okazja, by odprężyć ciało, wyciszyć umysł i\u00A0połączyć się z\u00A0otaczającą cię przyrodą.`,
		program: {
			naglowek: 'Relaks menu:',
			tresc: [
				`Joga przy dźwiękach mis\u00A0i\u00A0gongów (gra Agnieszka\u00A0Topp)`,
				`Relaks z\u00A0opaską na\u00A0oczach nasączona aromatycznymi olejkami`,
				`Zdrowy napar naszego przepisu`,
				`Inspirujące rozmowy w\u00A0kręgu`,
				`Upominek`,
			],
		},
		linkFormularza: 'https://forms.gle/kYN6VpfP3aV1b9yB8',
		// questionTemplate(subject) {
		// 	return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
		// },
	},
};
const yogaNaSupach = {
	type: `event`,
	extraClass: 'event',
	imgPath: `${htmlToImgsPath}/offer/events/sup/front`,
	galleryPath: `${htmlToImgsPath}/offer/events/sup/front`,
	fileName: `sup`,
	date: '2025-05-22',
	eventType: 'fixed',
	front: {
		nazwaWyjazdu: `Sup yoga`,
		listaDat: [`Latem`],
		rejon: `Zatoka Gdańska /\u00A0Jezioro Wysockie`,
		krotkiOpis: `Praktyka jogi na\u00A0wodzie, czyli prawdziwe zen\u00A0nature.`,
	},
	modal: {
		// imgModal: this.imgPath,
		tytulOpisu: 'O zajęciach:',
		pelnyOpis: `Zapraszam do\u00A0wodnego studia jogi. Zamieniamy matę na\u00A0deskę SUP. Poprawisz balans, wzmocnisz mięśnie posturalne. Otwarta przestrzeń z\u00A0nieskończonym oknem na\u00A0naturę stanowi doskonałą propozycję na\u00A0ciepłe dni. Czy jest coś wspanialszego od\u00A0jogi na\u00A0powietrzu? Promienie słońca, letni podmuch wiatru i\u00A0szum drzew dopełnią Twoją praktykę.`,
	},
};
const hotYoga = {
	type: `event`,
	extraClass: 'event',
	imgPath: `${htmlToImgsPath}/offer/events/hot_yoga/front`,
	galleryPath: `${htmlToImgsPath}/offer/events/hot_yoga/front`,
	fileName: `hot_yoga`,
	date: today,
	eventType: 'fixed',
	front: {
		nazwaWyjazdu: `HOT YOGA`,
		listaDat: [`Czwartki g.19.30`],
		rejon: `Limitless\u00A0by\u00A0autopay, Sopot`,
		krotkiOpis: `Unikatowa praktyka hot\u00A0yogi w\u00A0saunie`,
	},
	modal: {
		// imgModal: this.imgPath,
		tytulOpisu: 'O spotkaniu:',
		pelnyOpis: `Podwyższona temperatura w\u00A0saunie umożliwi dostęp do\u00A0głębszego rozluźnienia i\u00A0większej elastyczności ciała. Podrzegamy saunę do\u00A036\u00A0stopni. Przećwiczysz specjalnie dobrane pozycje siedzące i\u00A0leżące, które\u00A0łatwo zastosujesz w\u00A0życiu codziennym. Na\u00A0zakończenie czeka Cię sesja relaksacyjna i\u00A0seans saunowy prowadzony przez saunomistrza, z\u00A0dobranymi na\u00A0jesienną porę olejkami zwiększającymi odporność organizmu i\u00A0spokój umysłu.`,
		program: {
			naglowek: 'Relaks menu:',
			tresc: [
				`Joga w saunie`,
				`Aromaterapia`,
				`Kojący widok z\u00A0sauny na\u00A0morze`,
				`Napar Imbirowy`,
			],
		},
		uwaga: 'Cena: 110zł',
		linkFormularza: 'https://www.facebook.com/events/945794327582158',
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
const unSortedCamps = [kaszubyCamp, warmiaCamp];
const activeCamps = unSortedCamps.sort((x, y) => new Date(y.date) - new Date(x.date));
// list of active camps to sign for
const unsortedEvents = [hotYoga, yogaAndSound, yogaNaSupach];
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
	const menuLinks = document.querySelectorAll('ul li a');
	const hamburger = document.getElementById('burger');
	const wyjazdy = document.querySelector('#wyjazdy');
	const wydarzenia = document.querySelector('#wydarzenia');

	// if visited on iOS, remove nor supported backgroundAttachment fixed
	if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
		const header = document.querySelector('.top-image-header');
		header.style.backgroundAttachment = 'scroll';
	}
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
	const cookieCircleBtn = document.querySelector('.footer__pop-up-btn--cookies');
	const cookieCircleBtnX = document.querySelector('.footer__cookie-close');
	const cookiePopup = document.querySelector('.footer__cookie-pop-up');
	cookieCircleBtn.addEventListener('click', (e) => {
		e.preventDefault();
		cookiePopup.style.opacity = '1';
		cookiePopup.style.visibility = 'visible';
	});
	cookieCircleBtnX.addEventListener('click', (e) => {
		cookieCircleBtn.style.opacity = 0;
		cookiePopup.style.opacity = 0;

		setTimeout(() => {
			cookiePopup.style.visibility = 'hidden';
			cookieCircleBtn.style.display = 'none';
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
