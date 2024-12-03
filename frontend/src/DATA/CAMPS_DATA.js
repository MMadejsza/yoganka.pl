const htmlToImgsPath = `/imgs`;

export const CAMPS_DATA = [
	// Created camps so far
	{
		id: `CA01`,
		name: `Kojenie Zmysłów -\u00A0Kaszuby`,
		type: `camp`,
		date: `2024-10-11`,
		fileName: `camp_kaszuby`,
		imgPath: `${htmlToImgsPath}/offer/camps/camp_kaszuby/front`,
		galleryPath: `${htmlToImgsPath}/offer/camps/camp_kaszuby/gallery`,
		gallerySize: 12,
		eventType: ``,
		extraClass: ``,
		front: {
			title: `Kojenie Zmysłów
           Joga | Aromaterapia | SPA | SkinCare`,
			dates: [`11-13/10/2024`],
			location: `Kaszuby`,
			desc: ``,
			btnsContent: [],
		},
		modal: {
			fullDescTitle: ``,
			fullDesc: `Zabieram\u00A0Cię do\u00A0urokliwego domku, otulonego drewnem, gdzie schowamy\u00A0się w\u00A0ulubionych skarpetach, ciepłych swetrach i\u00A0ukoimy nasze zmysły. Nie\u00A0zabraknie jesiennej klasyki, czyli odpoczynku przy\u00A0kominku z\u00A0kubkiem aromatycznego naparu.`,
			glance: {
				title: ``,
				accommodation: `Dworek Krępkowice`,
				capacity: ``,
				price: `1200zł`,
				// travel: `we własnym zakresie`,
			},

			plan: {
				title: `Slow menu:`,
				schedule: [
					{
						'day': 'Piątek:',
						'16:00': 'Przyjazd, Spacery po okolicy',
						'18:00': 'Joga łagodna, relaksująca',
						'19:00': 'Zmysł smaku: wspólna kolacja',
						'21:00': `Zmysł dotyku: Skincare, czyli pielęgnacja twarzy, rozmowy przy kominku`,
					},
					{
						'day': 'Sobota:',
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
						'day': 'Niedziela:',
						'08:30': `Zmysł propriocepcji*:                            	          	
                                                       Joga Slow Flow`,
						'09:30': 'Nieśpieszne śniadanie',
						'CZAS WOLNY': '',
						'13:00': 'Lunch i pożegnanie',
						'*': 'zmysł czucia głębokiego, ciała w przestrzeni',
					},
				],
			},
			included: {
				title: `W Cenie:`,
				list: [
					`4 praktyki jogi (Slow Flow, Hatha, Nidra)`,
					`Warsztat świec i wosków`,
					`Skin care`,
					`Krąg`,
					`Upominek`,
					`Pobyt z Wyżywieniem`,
					`Kawa / Herbata / Napary 24/h`,
				],
			},
			excluded: {
				title: `We własnym zakresie:`,
				list: [`Dojazd`, `Ubezpieczenie`],
			},
			optional: {
				title: `Poszerz Slow Menu:`,
				list: [
					`Masaż Kobido 200zł/1h`,
					`Masaż Misami Tybetańskimi koszt na miejscu 150 zł`,
				],
			},
			freeTime: {
				title: `W Czasie Wolnym:`,
				//(note: statuses are free/optional/available for different icons)
				list: [
					{status: `free`, activity: `Kocyk, leśne spacery, pogaduchy, zdrowe napary`},
					{status: `optional`, activity: `Masaż Misami lub Kobido`},
					{status: `optional`, activity: `Sauna z balią`},
				],
			},
			note: `Zaserwuj sobie spokój i zdrowszą siebie. Wypełnij poniższe zgłoszenie`,
			formLink: `https://forms.gle/kYN6VpfP3aV1b9yB8`,
			questionTemplate(subject) {
				return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
			},
			program: {},
		},
	},
	{
		id: `CA02`,
		name: `Comfy slow weekend - Warmia`,
		type: `camp`,
		date: `2024-11-08`,
		fileName: `camp_warmia`,
		imgPath: `${htmlToImgsPath}/offer/camps/camp_warmia/front`,
		galleryPath: `${htmlToImgsPath}/offer/camps/camp_warmia/gallery`,
		gallerySize: 12,
		eventType: ``,
		extraClass: `long`,
		front: {
			title: `Comfy slow weekend
           Joga | Malowanie | SPA | Misy\u00A0i\u00A0gongi`,
			dates: [`08-11.11.2024`],
			location: `Warmia`,
			desc: ``,
			btnsContent: [],
		},

		modal: {
			opis: `Siostrzana energia, otulający zapach jesieni, atmosfera zrozumienia. Ten retreat to coś\u00A0więcej niż odpoczynek, to\u00A04-dniowa podróż do\u00A0siebie. Jeśli marzysz o takim wyjeździe, ale nie\u00A0masz z\u00A0kim pojechać, to\u00A0chcę Cię\u00A0uspokoić, że\u00A0poznasz na\u00A0miejscu fantastyczne kobiety. Oferuję szeroki wachlarz wspólnych zajęć.`,
			glance: {
				title: ``,
				accommodation: `Witramowo 32`,
				capacity: ``,
				cena: `1550zł`,
				// travel: `we własnym zakresie`,
			},
			plan: {
				title: `Slow menu:`,
				schedule: [
					{
						'day': 'Piątek:',
						'16:00': 'Zakwaterowanie',
						'18:00': 'Joga Yin',
						'19:00': 'Kolacja',
						'21:00': `Ciepła balia pod gwiazdami`,
					},
					{
						'day': 'Sobota:',
						'08:30': 'Joga Slow Flow',
						'09:30': 'Niespieszne śniadanie',
						'CZAS WOLNY': '',
						'14:00': 'Obiad + słodki poczęstunek',
						'16:00': 'Malowanie intuicyjne przy dźwiękach mis i gongów',
						'18:30': 'Uczta przy kolacji',
						'20:00': 'Rozmowy przy kominku/pogaduchy/film',
					},
					{
						'day': 'Niedziela:',
						'08:30': `Joga energetyczna slow flow`,
						'09:30': 'Niespieszne śniadanie',
						'CZAS WOLNY': '',
						'14:30': 'Obiad i słodki poczęstunek',
						'17:00': 'Joga yin',
						'18:30': 'Kolacja',
						'20:00': 'Rozmowy w kręgu z użyciem kart rozwojowych',
					},
					{
						'day': 'Poniedziałek:',
						'08:30': `Joga Slow Flow`,
						'09:30': 'Niespieszne śniadanie',
						'CZAS WOLNY': '',
						'13:00': 'Lunch i powrót do domu',
					},
				],
			},

			included: {
				title: `W Cenie:`,
				list: [
					`6 praktyk jogi`,
					`Malowanie intuicyjne`,
					`Koncert mis i gongów`,
					`Balia`,
					`Pobyt z Wyżywieniem`,
					`Kawa / Herbata / Napary 24/h`,
				],
			},

			excluded: {
				title: `Poszerz Slow Menu:`,
				list: [
					`Masaż Kobido 30zł/30min`,
					`Masaż Misami Tybetańskimi 120 zł/45min`,
					`Sauna (jeszcze w budowie)`,
				],
			},
			optional: {
				title: `W Czasie Wolnym:`,
				//(note: statuses are free/optional/available for different icons)
				list: [
					{status: `free`, aktywnosc: `Kocyk, leśne spacery, pogaduchy, zdrowe napary`},
					{status: `optional`, aktywnosc: `Masaż Misami oraz Kobido`},
					{status: `optional`, aktywnosc: `Sauna`},
				],
			},
			// freeTime: {
			// 	title: `W Czasie Wolnym:`,
			// 	//(note: statuses are free/optional/available for different icons)
			// 	list: [
			// 		{status: `free`, activity: `Kocyk, leśne spacery, pogaduchy, zdrowe napary`},
			// 		{status: `optional`, activity: `Masaż Misami lub Kobido`},
			// 		{status: `optional`, activity: `Sauna z balią`},
			// 	],
			// },
			note: `Zaserwuj sobie spokój i zdrowszą siebie.`,
			formLink: `https://forms.gle/6Ri5sqnXgUQGSRNT9`,
			questionTemplate(subject) {
				return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
			},
		},
	},
];
