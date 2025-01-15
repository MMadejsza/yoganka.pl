import {whatsAppTemplate} from '../utils/utils.js';
const htmlToImgsPath = `/imgs`;

export const CAMPS_DATA = [
	{
		id: `CA04`,
		name: `Summer Chill Camp`,
		type: `camp`,
		date: `2025-06-28`,
		fileName: `camp_chill`,
		imgPath: `${htmlToImgsPath}/offer/camps/camp_chill/front`,
		galleryPath: `${htmlToImgsPath}/offer/camps/camp_chill/gallery`,
		gallerySize: 9,
		eventType: ``,
		extraClass: ``,
		front: {
			title: `Summer Chill Camp`,
			dates: [`27-30.06.2025`],
			location: `Wipsowo 44`,
			desc: `W PRZYGOTOWANIU`,
			btnsContent: [],
		},
		modal: {
			fullDescTitle: ``,
			fullDesc: `Letni camp w\u00A0magicznym Wipsowie. 4\u00A0dni pełne relaksu, natury, pysznego jedzenia i\u00A0oczywiście jogi! Pełna oferta dostępna na\u00A0początku 2025.`,
			glance: {
				title: `W przygotowaniu!`,
				area: ``,
				accommodation: ``,
				capacity: ``,
				price: ``,
				travel: ``,
			},

			plan: {
				title: ``,
				schedule: [],
			},
			summary: {},
			note: ``,
			btnsContent: [],
			formLink: `https://forms.gle/recTtsdmUdY71wwv5`,
			questionTemplate(subject) {
				return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
			},
			program: {},
		},
	},
	{
		id: `CA04`,
		name: `Summer Chill Camp`,
		type: `camp`,
		date: `2025-06-28`,
		fileName: `camp_chill`,
		imgPath: `${htmlToImgsPath}/offer/camps/camp_chill/front`,
		galleryPath: `${htmlToImgsPath}/offer/camps/camp_chill/gallery`,
		gallerySize: 9,
		eventType: ``,
		extraClass: ``,
		front: {
			title: `Summer Chill Camp`,
			dates: [`27-30.06.2025`],
			location: `Wipsowo 44`,
			desc: `W PRZYGOTOWANIU`,
			btnsContent: [],
		},
		modal: {
			fullDescTitle: ``,
			fullDesc: `Letni camp w\u00A0magicznym Wipsowie. 4\u00A0dni pełne relaksu, natury, pysznego jedzenia i\u00A0oczywiście jogi! Pełna oferta dostępna na\u00A0początku 2025.`,
			glance: {
				title: `W przygotowaniu!`,
				area: ``,
				accommodation: ``,
				capacity: ``,
				price: ``,
				travel: ``,
			},

			plan: {
				title: ``,
				schedule: [],
			},
			summary: {},
			note: ``,
			btnsContent: [],
			formLink: `https://forms.gle/recTtsdmUdY71wwv5`,
			questionTemplate(subject) {
				return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
			},
			program: {},
		},
	},
	{
		id: `CA03`,
		name: `Kobieca harmonia -
		JOGA | ASTROLOGIA | ECSTATIC DANCE`,
		type: `camp`,
		date: `2025-03-07`,
		fileName: `camp_harmonia`,
		imgPath: `${htmlToImgsPath}/offer/camps/camp_harmonia/front`,
		galleryPath: `${htmlToImgsPath}/offer/camps/camp_harmonia/gallery`,
		gallerySize: 7,
		eventType: ``,
		extraClass: ``,
		front: {
			title: `Kobieca harmonia
					Joga | Astrologia
					| Ecstatic Dance`,
			dates: [`07-09.03.2025`],
			location: `Stara Szkoła Wysoka Wieś`,
			desc: `...`,
			btnsContent: [],
		},
		modal: {
			fullDescTitle: ``,
			fullDesc: `Zanurz się w\u00A0wyjątkowy kobiecy weekend na\u00A0Warmii, gdzie zrelaksujesz ciało, umysł i\u00A0duszę. Czekają na\u00A0Ciebie codzienne praktyki jogi i\u00A0medytacji w\u00A0kameralnym gronie, w\u00A0otoczeniu malowniczej przyrody. Rozpieszczą Cię zdrowe, wegetariańskie posiłki przygotowane z\u00A0lokalnych składników. Południa spędzimy na\u00A0astrologicznych odkryciach, wspólnie eksplorując kobiecą energię Wenus. A\u00A0wieczorem podczas ecstatic dance wyzwolisz swoją wolność.

			Dodatkowo, przygotowałam wieczór pielęgnacyjny twarzy z\u00A0naturalnymi kosmetykami, abyś poczuła się piękna i\u00A0zadbana. Odpoczniesz również w saunie, pozwalając ciepłu uwolnić napięcia i\u00A0zregenerować ciało. To czas, by zadbać o\u00A0siebie w\u00A0pełni, poczuć harmonię z\u00A0sobą i\u00A0gwiazdami.

			Dołącz do\u00A0nas i\u00A0spraw, by\u00A0Dzień Kobiet był czasem, który\u00A0zapamiętasz na\u00A0długo!`,
			glance: {
				title: ``,
				area: `Ostróda`,
				accommodation: `Stara Szkoła Wysoka Wieś`,
				// capacity: `12`,
				price: `1199zł do 10 stycznia
				1269zł od 11 stycznia`,
				// travel: `we własnym zakresie`,
			},

			plan: {
				title: `Slow Menu`,
				schedule: [
					{
						'day': 'Piątek:',
						'15:00': 'Możliwość przyjazdu, spacery',
						'18:00': 'Joga łagodna, relaksująca',
						'19:00': 'Wspólna kolacja',
						'21:00': `Krąg powitalny, skincare, babskie\u00A0pogaduchy`,
					},
					{
						'day': 'Sobota:',
						'08:00': 'Joga Slow Flow Vinyasa',
						'10:00': 'Niespieszne śniadanko',
						'11:30': `Aktywuj swoją wenus, warsztaty astrologiczne z\u00A0kubkiem kakao`,
						'15:00': 'Obiad',
						'16:30': 'CZAS WOLNY',
						'18:00': 'Kolacja',
						'20:00': 'Joga wieczorna',

						'21:30': 'Ecstatic Dance +\u00A0ceremonia kakao',
					},
					{
						'day': 'Niedziela:',
						'08:00': 'Joga Slow Flow Vinyasa',
						'09:45': 'Niespieszne śniadanko',
						'11:00': `spacer leśny w ciszy`,
						'12:00': 'Sesja Mindfulness',
						'13:30': `Lunch i\u00A0wyjazd do\u00A0domu`,
					},
				],
			},
			summary: {
				included: {
					title: `Cena zawiera:`,
					list: [
						`4 praktyki jogi`,
						`Warsztat astrologii`,
						`Skin Care`,
						`Ecstatic Dance`,
						`Sauna`,
						`Pobyt z Wyżywieniem`,
						`Kawa / Herbata / Napary 24/h`,
					],
				},
				freeTime: {
					title: `W Czasie Wolnym:`,
					//(note: statuses are free/optional/available for different icons)
					list: [
						{
							status: `free`,
							activity: `Leśne spacery`,
						},
						{status: `free`, activity: `Zdrowe napary`},
						{status: `free`, activity: `Sauna`},
					],
				},
			},
			note: `Gotowa na niesamowity weekend?`,
			btnsContent: [
				{
					action: 'classic',
					text: `WhatsApp`,
					link: whatsAppTemplate(),
					icon: 'fa-brands fa-whatsapp',
				},
				{
					action: 'classic',
					text: `Wypełnij formularz`,
					link: `https://forms.gle/recTtsdmUdY71wwv5`,
				},
			],
			formLink: `https://forms.gle/recTtsdmUdY71wwv5`,
			questionTemplate(subject) {
				return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
			},
			program: {},
		},
	},
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
				title: `W skrócie:`,
				accommodation: `Dworek Krępkowice`,
				capacity: `12`,
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
			summary: {
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
						{
							status: `free`,
							activity: `Kocyk, leśne spacery, pogaduchy, zdrowe napary`,
						},
						{status: `optional`, activity: `Masaż Misami lub Kobido`},
						{status: `optional`, activity: `Sauna z balią`},
					],
				},
			},
			note: `Zaserwuj sobie spokój i zdrowszą siebie. Wypełnij poniższe zgłoszenie`,
			btnsContent: [
				{
					action: 'classic',
					text: `Wypełnij formularz`,
					link: `https://forms.gle/kYN6VpfP3aV1b9yB8`,
				},
				{
					action: 'classic',
					text: `WhatsApp`,
					link: whatsAppTemplate(),
					icon: 'fa-brands fa-whatsapp',
				},
			],
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
			fullDescTitle: '',
			fullDesc: `Siostrzana energia, otulający zapach jesieni, atmosfera zrozumienia. Ten retreat to coś\u00A0więcej niż odpoczynek, to\u00A04-dniowa podróż do\u00A0siebie. Jeśli marzysz o takim wyjeździe, ale nie\u00A0masz z\u00A0kim pojechać, to\u00A0chcę Cię\u00A0uspokoić, że\u00A0poznasz na\u00A0miejscu fantastyczne kobiety. Oferuję szeroki wachlarz wspólnych zajęć.`,
			glance: {
				title: ``,
				accommodation: `Witramowo 32`,
				capacity: ``,
				price: `1550zł`,
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
			summary: {
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
				optional: {
					title: `Poszerz Slow Menu:`,
					list: [
						`Masaż Kobido 30zł/30min`,
						`Masaż Misami Tybetańskimi 120 zł/45min`,
						`Sauna (jeszcze w budowie)`,
					],
				},
				freeTime: {
					title: `W Czasie Wolnym:`,
					//(note: statuses are free/optional/available for different icons)
					list: [
						{
							status: `free`,
							activity: `Kocyk, leśne spacery, pogaduchy, zdrowe napary`,
						},
						{status: `optional`, activity: `Masaż Misami oraz Kobido`},
						{status: `optional`, activity: `Sauna`},
					],
				},
			},
			note: `Zaserwuj sobie spokój i zdrowszą siebie.`,
			btnsContent: [
				{action: 'classic', text: `Dołączam`, link: `https://forms.gle/6Ri5sqnXgUQGSRNT9`},
				{
					action: 'classic',
					text: `WhatsApp`,
					link: whatsAppTemplate(),
					icon: 'fa-brands fa-whatsapp',
				},
			],
			formLink: `https://forms.gle/6Ri5sqnXgUQGSRNT9`,
			questionTemplate(subject) {
				return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
			},
		},
	},
].sort((x, y) => {
	const today = new Date();
	const dateX = new Date(x.date);
	const dateY = new Date(y.date);

	// Send to the end if archived
	const isXPast = dateX < today;
	const isYPast = dateY < today;

	if (isXPast && !isYPast) return 1; // x past, y future -> x goes last
	if (!isXPast && isYPast) return -1; // x future, y past

	// Sort normal within splitted groups
	return dateX - dateY;
});
