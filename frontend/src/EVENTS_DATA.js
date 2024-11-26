const htmlToImgsPath = '/imgs';

export const EVENTS_DATA = [
	// Created active classes so far
	{
		type: `event`,
		extraClass: 'event',
		imgPath: `${htmlToImgsPath}/offer/events/yoga_breakfast/front`,
		galleryPath: `${htmlToImgsPath}/offer/events/yoga_breakfast/front`,
		fileName: `yoga_breakfast`,
		date: '2024-11-27',
		eventType: 'fixed',
		front: {
			nazwaWyjazdu: `Yoga\u00A0&\u00A0Breakfast`,
			listaDat: ['01/12/2024'],
			rejon: `toMy Kawiarnia\u00A0Gdańsk`,
			krotkiOpis: `Błogi poranek z jogą w uroczej przestrzeni toMy kawiarnia w Gdańsku...`,
		},
		modal: {
			// imgModal: this.imgPath,
			tytulOpisu: 'O spotkaniu:',
			pelnyOpis: `Błogi poranek z\u00A0ogą w\u00A0uroczej przestrzeni toMy kawiarnia\u00A0w\u00A0Gdańsku. Po praktyce usiądziemy razem do\u00A0stołu i\u00A0zjemy pyszne śniadanie przygotowane przez pracowników kawiarni. Zabierz swoją matę. Możesz dołączyć też tylko na\u00A0samą praktykę.			
			
			Do zobaczenia!`,
			program: {
				naglowek: 'Relaks menu:',
				tresc: ['Praktyka jogi (50min)', 'Zdrowy napar', 'Śniadanie wegetariańskie'],
			},
			linkFormularza: 'mailto:kontakt@yoganka.pl?&body=Hej! Piszę do Ciebie z yoganka.pl',
			uwaga: `Wymiana: 40 zł bez śniadania
			80zł ze śniadaniem
			(w obu wariantach napar już w cenie)`,
			// questionTemplate(subject) {
			// 	return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
			// },
		},
	},
	{
		type: `event`,
		extraClass: 'event',
		imgPath: `${htmlToImgsPath}/offer/events/jurta/front`,
		galleryPath: `${htmlToImgsPath}/offer/events/jurta/front`,
		fileName: `jurta`,
		date: '2024-11-27',
		eventType: 'repetitive',
		front: {
			nazwaWyjazdu: `Wieczorna joga w\u00A0jurcie`,
			listaDat: [`Środy 19:30`, '27/11/2024'],
			rejon: `Jurta ul.\u00A0Makowa\u00A08, Tuchom`,
			krotkiOpis: `Zapraszam Cię na wyjątkową praktykę jogi w przytulnej jurcie`,
		},
		modal: {
			// imgModal: this.imgPath,
			tytulOpisu: 'O praktyce:',
			pelnyOpis: `Zapraszam Cię na\u00A0wyjątkową praktykę jogi w\u00A0przytulnej jurcie. Jej kształt, drewniane wnętrze, ogień kominka sprzyjają odprężającej praktyce. Spotykamy się w\u00A0kameralnym gronie w\u00A0każdą środę o\u00A019.30.`,
			program: {
				naglowek: 'Relaks menu:',
				tresc: [
					'Medytacja',
					'Ćwiczenia oddechowe',
					'Joga hatha oraz Yin',
					'Dłuższa relaksacja',
				],
			},
			linkFormularza: 'mailto:kontakt@yoganka.pl?&body=Hej! Piszę do Ciebie z yoganka.pl',
			uwaga: `Cena: 50zł`,
			// questionTemplate(subject) {
			// 	return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
			// },
		},
	},
	{
		type: `event`,
		extraClass: 'event',
		imgPath: `${htmlToImgsPath}/offer/events/yoga&sound/front`,
		galleryPath: `${htmlToImgsPath}/offer/events/yoga&sound/front`,
		fileName: `ys`,
		date: '2025-05-21',
		eventType: 'repetitive',
		front: {
			nazwaWyjazdu: `YOGA\u00A0&\u00A0SOUND
		Moon\u00A0Ceremony`,
			listaDat: [`Latem`],
			rejon: `Plaże w Gdańsku`,
			krotkiOpis: `Joga na\u00A0plaży przy pełni księżyca z\u00A0dźwiękami mis i\u00A0gongów w\u00A0tle, które wprowadzą Cię w\u00A0relaksującą podróż`,
		},
		modal: {
			// imgModal: this.imgPath,
			tytulOpisu: 'O spotkaniu:',
			pelnyOpis: `Takiego wydarzenia w\u00A0Trójmieście nie\u00A0było. Dźwięki mis\u00A0i\u00A0gongów tworzą kojącą atmosferę, pomagając w\u00A0głębszym relaksie i medytacji. Pod rozgwieżdżonym niebem, wśród szumu fal, każda asana staje się bardziej intymna i\u00A0energetyzująca. Bliskość natury i\u00A0moc pełni księżyca dodają praktyce niezwykłej mocy uzdrawiającej. To idealna okazja, by odprężyć ciało, wyciszyć umysł i\u00A0połączyć się z\u00A0otaczającą cię przyrodą.`,
			program: {
				naglowek: 'Relaks menu:',
				tresc: [
					`Joga przy dźwiękach mis\u00A0i\u00A0gongów (gra Agnieszka\u00A0Topp)`,
					`Relaks z\u00A0opaską na\u00A0oczach nasączoną aromatycznymi olejkami`,
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
	},
	{
		type: `event`,
		extraClass: 'event',
		imgPath: `${htmlToImgsPath}/offer/events/sup/front`,
		galleryPath: `${htmlToImgsPath}/offer/events/sup/front`,
		fileName: `sup`,
		date: '2025-05-22',
		eventType: 'repetitive',
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
	},
];
