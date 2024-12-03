const htmlToImgsPath = '/imgs';

export const CAMPS_DATA = [
	// Created camps so far
	{
		id: 'CA01',
		name: 'Kojenie Zmysłów - Kaszuby',
		type: `camp`,
		extraClass: '',
		date: '2024-10-11',
		fileName: `camp_kaszuby`,
		imgPath: `${htmlToImgsPath}/offer/camps/camp_kaszuby/front`,
		galleryPath: `${htmlToImgsPath}/offer/camps/camp_kaszuby/gallery`,
		gallerySize: 12,
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
						'16:00':
							'Zmysł węchu: aromaterapia, warsztat świec bubble, wosków + wykład',
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
				tresc: [
					'Masaż Kobido 200zł/1h',
					'Masaż Misami Tybetańskimi koszt na miejscu 150 zł',
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
			// dodaj tresć btns
			linkFormularza: 'https://forms.gle/kYN6VpfP3aV1b9yB8',
			questionTemplate(subject) {
				return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
			},
		},
	},
	{
		id: 'CA02',
		name: 'Comfy slow weekend - Warmia',
		type: `camp`,
		extraClass: 'long',
		date: '2024-11-08',
		fileName: `camp_warmia`,
		imgPath: `${htmlToImgsPath}/offer/camps/camp_warmia/front`,
		galleryPath: `${htmlToImgsPath}/offer/camps/camp_warmia/gallery`,
		gallerySize: 12,
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
	},
];
