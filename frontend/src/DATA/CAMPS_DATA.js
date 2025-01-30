import {whatsAppTemplate} from '../utils/utils.jsx';
const htmlToImgsPath = `/imgs`;

export const CAMPS_DATA = [
	// Add comments for each property
	{
		id: `CA07`,
		name: `Peak Yoga Camp wakacje z jogą w górach`,
		type: `camp`,
		date: `2025-08-05`,
		link: `camp-peak-yoga`,
		fileName: `camp_peak_yoga`,
		imgPath: `${htmlToImgsPath}/offer/camps/camp_peak_yoga/front`,
		galleryPath: `${htmlToImgsPath}/offer/camps/camp_peak_yoga/gallery`,
		gallerySize: 6,
		eventType: ``,
		extraClass: `long`,
		front: {
			title: `Peak Yoga Camp
			wakacje z\u00A0jogą w\u00A0górach`,
			dates: [`05-10.08.2025`],
			location: `Beskid Wyspowy`,
			desc: `...`,
			btnsContent: [],
		},
		modal: {
			fullDescTitle: ``,
			fullDesc: `Wakacje z\u00A0jogą, czyli aż\u00A06 dni wytchnienia w\u00A0górskim raju. Poziomkowa Górka to miejsce, gdzie natura spotyka\u00A0się z\u00A0harmonią ciała i\u00A0ducha. Poranki z\u00A0widokiem na\u00A0szczyty,  kojące górskie powietrze, joga, medytacja, piesze wędrówki sprawią, że\u00A0to będzie wyjątkowy czas. To moment tylko dla\u00A0Ciebie – na\u00A0oddech, zwolnienie tempa i\u00A0odnalezienie równowagi w magicznej atmosferze górskiego spokoju. Harmonogram jest poglądowy, stałą częścią dnia będą posiłki i\u00A0sesje jogi. W czasie wolnym piesze wędrówki, lokalne wycieczki wg. uznania. Wieczory to czas na\u00A0regenerację i\u00A0odpoczynek np. w\u00A0saunie. Warsztat ceramiczny w\u00A0przygotowaniu, odbędzie\u00A0się w\u00A0wybrany\u00A0dzień.`,
			glance: {
				title: ``,
				area: `Karpaty`,
				accommodation: `Poziomkowa Górka`,
				price: `3011zł*`,
			},

			plan: {
				title: `Slow menu`,
				schedule: [
					{
						'day': 'Wtorek:',
						'17:00': 'Możliwość przyjazdu, spacery',
						'18:00': `Spotkanie przy stole -\u00A0wspólna kolacja`,
						'19:30': 'Joga wieczorna',
					},
					{
						'day': 'Środa - Sobota:',
						'08:30': 'Poranna joga',
						'10:00': 'Niespieszne śniadanie',
						'11:00': `Górskie wędrówki`,
						'15:00': `Spotkanie przy stole -\u00A0wspólny obiad`,
						'19:00': `Joga wieczorna (yin/nidra/hatha)`,
					},
					{
						'day': 'Niedziela:',
						'08:30': 'Joga pożegnalna (1,5h)',
						'10:00': 'Niespieszne śniadanie',
						'11:00': `Pożegnanie i\u00A0wyjazd`,
					},
					{
						'day': '*Uwagi*',
						'*': 'Przedstawione informacje są poglądowe',
						'**': 'Godziny mogą ulec zmianie',
						'***': `W przygotowaniu warsztat kreatywny `,
					},
				],
			},
			summary: {
				included: {
					title: `Cena zawiera:`,
					list: [
						`11h jogi`,
						`3h medytacji`,
						`2h mindfulness`,
						`Warsztat kreatywny`,
						`3 pyszne posiłki dziennie`,
						`5 noclegów`,
					],
				},
				optional: {
					title: `Poszerz slow menu:`,
					list: [`Masaże`, `Sauna`, `Jacuzzi`],
				},
				freeTime: {
					title: `W czasie wolnym:`,
					//(note: statuses are free/optional/available for different icons)
					list: [
						{status: `free`, activity: `Górskie wędrówki`},
						{status: `free`, activity: `Zwiedzanie okolic`},
						{
							status: `free`,
							activity: `Wycieczki (np. skansen w\u00A0Laskowej, nad\u00A0jezioro)`,
						},
						{status: `free`, activity: `Relaks`},
						{status: `optional`, activity: `Sauna`},
						{status: `optional`, activity: `Jacuzzi`},
					],
				},
			},
			note: `Gotowa na wakacje z jogą?`,
			btnsContent: [
				{
					action: 'classic',
					text: `WhatsApp`,
					title: `Wiadomość WhatsApp`,
					link: whatsAppTemplate(),
					icon: 'fa-brands fa-whatsapp',
				},
				{
					action: 'classic',
					title: `Formularz Google w osobnej zakładce`,
					text: `Wypełnij formularz`,
					symbol: `edit`,
					link: `https://forms.gle/fX2Dx8KJaBhQFEGh9`,
				},
			],
			// questionTemplate(subject) {
			// 	return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
			// },
			program: {},
		},
	},
	{
		id: `CA06`,
		name: `Energia liczb i moc jogi. Joga | Numerologia	| Aromaterapia`,
		type: `camp`,
		date: `2025-10-24`,
		link: `camp-energia-liczb`,
		fileName: `camp_energia_liczb`,
		imgPath: `${htmlToImgsPath}/offer/camps/camp_energia_liczb/front`,
		galleryPath: `${htmlToImgsPath}/offer/camps/camp_energia_liczb/gallery`,
		gallerySize: 5,
		eventType: ``,
		extraClass: ``,
		front: {
			title: `Energia liczb i\u00A0moc\u00A0jogi  
					Joga |\u00A0Numerologia
					|\u00A0Aromaterapia`,
			dates: [`24-26.10.2025`],
			location: `Mazury`,
			desc: `...`,
			btnsContent: [],
		},
		modal: {
			fullDescTitle: ``,
			fullDesc: `Wyjątkowa propozycja na jesienny weekend i\u00A0ostatni warsztat w\u00A02025\u00A0roku. Wybieramy się na Mazury, gdzie zaszyjemy się w przytulnej przestrzeni GROM otoczeni lasem. Będziemy odpuszczać wszystko co nie\u00A0służy dzięki jodze, zagłębiać\u00A0się w\u00A0tajniki numerologii oraz odprężymy\u00A0się przy tworzeniu wosków/świec sojowych. Jesienne wieczory poświęcimy na odpoczynek.`,
			glance: {
				title: ``,
				area: `Grom`,
				accommodation: `Przestrzeń GROM`,
				price: `1444zł`,
			},

			plan: {
				title: `Slow menu`,
				schedule: [
					{
						'day': 'Piątek:',
						'16:00': 'Możliwość przyjazdu, spacery',
						'17:00': 'Joga wieczorna (1,5h)',
						'19:00': `Spotkanie przy stole -\u00A0wspólna kolacja`,
						'21:00': `Regeneracja w\u00A0saunie`,
					},
					{
						'day': 'Sobota:',
						'08:00': 'Joga na dobry dzień (Slow Flow Vinyasa 1h)',
						'09:30': 'Niespieszne śniadanie',
						'11:11': `Warsztat numerologii z Olgą Siedorow`,
						'14:00': `Spotkanie przy stole -\u00A0wspólny obiad`,
						'17:00': `Warsztat tworzenia wosków/świec\u00A0sojowych (2h)`,
						'19:00': `Spotkanie przy stole -\u00A0wspólna kolacja`,
						'20:30': 'Joga Nidra',
					},
					{
						'day': 'Niedziela:',
						'08:30': 'Joga pożegnalna (1,5h)',
						'10:00': 'Niespieszne śniadanie',
						'11:00': `Spacery /\u00A0czas\u00A0wolny`,
						'13:30': `Lunch i\u00A0pożegnanie`,
						'*': 'Godziny mogą ulec zmianie',
					},
				],
			},
			summary: {
				included: {
					title: `Cena zawiera:`,
					list: [
						`5h jogi`,
						`2h warsztatów numerologii`,
						`2h warsztatów aromaterapii`,
						`3 pyszne posiłki dziennie`,
						`2 noclegi`,
						`Sauna`,
						`Upominek`,
					],
				},
				freeTime: {
					title: `W czasie wolnym:`,
					//(note: statuses are free/optional/available for different icons)
					list: [
						{status: `free`, activity: `Leśne spacery`},
						{status: `free`, activity: `Pogaduchy`},
						{status: `free`, activity: `Relaks`},
					],
				},
			},
			note: `Gotowa na jesienne otulenie?`,
			btnsContent: [
				{
					action: 'classic',
					text: `WhatsApp`,
					title: `Wiadomość WhatsApp`,
					link: whatsAppTemplate(),
					icon: 'fa-brands fa-whatsapp',
				},
				{
					action: 'classic',
					title: `Formularz Google w osobnej zakładce`,

					text: `Wypełnij formularz`,
					symbol: `edit`,
					link: `https://forms.gle/fX2Dx8KJaBhQFEGh9`,
				},
			],
			// questionTemplate(subject) {
			// 	return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
			// },
			program: {},
		},
	},
	{
		id: `CA05`,
		name: `Joga | SPA | Ajurweda`,
		type: `camp`,
		date: `2025-05-16`,
		link: `camp-ajurweda`,
		fileName: `camp_ajurweda`,
		imgPath: `${htmlToImgsPath}/offer/camps/camp_ajurweda/front`,
		galleryPath: `${htmlToImgsPath}/offer/camps/camp_ajurweda/gallery`,
		gallerySize: 7,
		eventType: ``,
		extraClass: ``,
		front: {
			title: `Joga | SPA | Ajurweda`,
			dates: [`16-18.05.2025`],
			location: `Warmia`,
			desc: `...`,
			btnsContent: [],
		},
		modal: {
			fullDescTitle: ``,
			fullDesc: `Joga w\u00A0agroturystyce z\u00A0profesjonalnymi zabiegami spa to\u00A0doskonała propozycja na\u00A0wiosenne przebudzenie oraz\u00A0odprężenie. Rojst słynie z\u00A0leczniczej borowiny, której nie\u00A0omieszkamy wypróbować. Warsztaty ajurwedy będą dopełnieniem weekendu,  pokazując Ci możliwości harmonijnego życia. Położenie ośrodka sprzyja rowerowym wycieczkom, gdyż\u00A0nieopodal rozciąga\u00A0się malowniczka ścieżka GreenVelo!`,
			glance: {
				title: ``,
				area: `Krawczyki k. Bartoszyc`,
				accommodation: `Rojst Borowinowy Las`,
				price: `1333zł`,
			},

			plan: {
				title: `Slow menu`,
				schedule: [
					{
						'day': 'Piątek:',
						'16:00': 'Możliwość przyjazdu, spacery',
						'18:00': 'Joga wieczorna',
						'19:00': `Spotkanie przy stole -\u00A0wspólna kolacja`,
						'21:00': `Relaks w\u00A0saunie z\u00A0balią`,
					},
					{
						'day': 'Sobota:',
						'09:00': 'Joga Slow Flow Vinyasa',
						'10:00': 'Niespieszne śniadanie',
						'11:30': `Pierwsze zabiegi w\u00A0spa /\u00A0czas wolny/\u00A0spacery /\u00A0wycieczka\u00A0rowerowa`,
						'15:00': `Spotkanie przy stole -\u00A0wspólny obiad`,
						'16:30': 'Ajurweda',
						'19:00': `Spotkanie przy stole -\u00A0wspólna kolacja`,
						'20:30': 'Joga na dobranoc',
					},
					{
						'day': 'Niedziela:',
						'08:30': 'Poranna joga (1,5h)',
						'10:00': 'Niespieszne śniadanie',
						'11:00': `Zabiegi w\u00A0spa /\u00A0czas\u00A0wolny`,
						'13:30': `Lunch i\u00A0pożegnanie`,
					},
				],
			},
			summary: {
				included: {
					title: `Cena zawiera:`,
					list: [
						`5h jogi`,
						`2h Warsztat ajurwedy`,
						`3 pyszne posiłki dziennie`,
						`2 noclegi`,
						`Rowery (8 sztuk)`,
						`Bilard`,
						`Kawa / Herbata / Napary\u00A024/h`,
					],
				},
				excluded: {
					title: `Poszerz slow menu:`,
					list: [`Masaże`, `Zabiegi spa`],
				},
				freeTime: {
					title: `W czasie wolnym:`,
					//(note: statuses are free/optional/available for different icons)
					list: [
						{status: `free`, activity: `Wycieczki rowerowe`},
						{status: `free`, activity: `Spacery`},
						{status: `optional`, activity: `Masaże`},
						{status: `optional`, activity: `Zabiegi spa`},
					],
				},
			},
			note: `Gotowa na wiosenne odprężenie?`,
			btnsContent: [
				{
					action: 'classic',
					text: `WhatsApp`,
					title: `Wiadomość WhatsApp`,
					link: whatsAppTemplate(),
					icon: 'fa-brands fa-whatsapp',
				},
				{
					action: 'classic',
					title: `Formularz Google w osobnej zakładce`,

					text: `Wypełnij formularz`,
					symbol: `edit`,
					link: `https://forms.gle/fX2Dx8KJaBhQFEGh9`,
				},
			],
			// questionTemplate(subject) {
			// 	return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
			// },
			program: {},
		},
	},
	{
		id: `CA04`,
		name: `Summer ZenNature Camp`,
		type: `camp`,
		date: `2025-06-28`,
		link: `camp-summer-zennature`,
		fileName: `camp_zennature`,
		imgPath: `${htmlToImgsPath}/offer/camps/camp_zennature/front`,
		galleryPath: `${htmlToImgsPath}/offer/camps/camp_zennature/gallery`,
		gallerySize: 9,
		eventType: ``,
		extraClass: `long`,
		front: {
			title: `Summer ZenNature Camp`,
			dates: [`27-30.06.2025`],
			location: `Warmia`,
			desc: `W PRZYGOTOWANIU`,
			btnsContent: [],
		},
		modal: {
			fullDescTitle: ``,
			fullDesc: `Zanurzysz\u00A0się w\u00A0letnim błogostanie, gdzie czas zwalnia, oddech\u00A0się wydłuża, a\u00A0ciało i\u00A0dusza odnajdują pełną harmonię. W samym sercu mazurskiej natury, w\u00A0miejscu pulsującym spokojem, czeka\u00A0na Ciebie wyjątkowa przestrzeń relaksu i\u00A0odnowy. Tak można opisać błogie Wipsowo 44. Te cztery dni to czas obfity w\u00A0jogę w\u00A0rytmie natury na drewnianym tarasie z\u00A0lasem w\u00A0tle, kojące rytuały ziołowe w\u00A0pa w\u00A0kurniku, kąpiele w\u00A0jeziorze, spacery na\u00A0boso i\u00A0drzemki w\u00A0hamakach. Dopełnieniem będzie warsztat tworzenia biżuterii z\u00A0kamieni naturalnych ze\u00A0Studiem Cudo. Bez wahania musisz tego doświadczyć! 
			Plan godzinowy może ulec zmianie, codziennie rano i\u00A0wieczorem sesja jogi, pranayama, dużo czasu wolnego na regenerację. Wrócisz wypoczęta i\u00A0personalizowanym naszyjnikiem!`,
			glance: {
				title: ``,
				area: `Wipsowo`,
				accommodation: `Wipsowo 44`,
				capacity: ``,
				price: `2222zł`,
				travel: ``,
			},

			plan: {
				title: `Poglądowe ZenNature  menu`,
				schedule: [
					{
						'day': 'Piątek:',
						'16:00': 'Możliwość przyjazdu, zenNature, błogi\u00A0relaks',
						'18:00': 'Kolacja',
						'20:00': `Zen Yoga`,
						'21:30': `Ciepło ogniska`,
					},
					{
						'day': 'Sobota:',
						'08:30': 'Sunrise yoga',
						'09:45': 'Niespieszne śniadanie',
						'11:00': `Zen nature: bose spacery, malowanie, drzemki w\u00A0hamakach, kąpiele`,
						'14:00': `Spotkanie przy stole - obiad`,
						'17:00': `Mindfulness`,
						'18:00': `Spotkanie przy stole:\u00A0kolacja`,
						'20:00': `Sunset yoga`,
					},
					{
						'day': 'Niedziela:',
						'08:00': 'Medytacja w widokiem na las',
						'08:30': 'Sunrise yoga',
						'09:30': 'Niespieszne śniadanie',
						'11:30': `Naszyjniki z kamieni`,
						'14:00': `Spotkanie przy stole - obiad`,
						'15:30': `Czas wolny: spa w kurniku, malowanie, spacery, kąpiele`,
						'18:00': `Spotkanie przy stole:\u00A0kolacja`,
						'20:00': `Sunset yoga nidra +\u00A0yin`,
						'21:30': `Ruska bania dla\u00A0chętnych (dodatkowo\u00A0płatna)`,
					},
					{
						'day': 'Poniedziałek:',
						'08:00': 'Joga na\u00A0pożegnanie',
						'09:30': 'Niespieszne śniadanie',
						'12:00': 'Wymeldowanie i\u00A0powrót do\u00A0domu',
					},
				],
			},
			summary: {
				included: {
					title: `W cenie:`,
					list: [
						`7h jogi`,
						`2h Warsztatu biżuterii`,
						`3 noce`,
						`3x dziennie pełne wyżywienie`,
						`Malowanie w plenerze`,
						`Medytacja oraz sesja mindfulness`,
					],
				},
				optional: {
					title: `Poszerz zen menu:`,
					list: [
						`Ruska bania 600zł/grupa (min. 12\u00A0osób)`,
						`Rytuał spa w\u00A0kurniku 160zł/osoba`,
					],
				},
				freeTime: {
					title: `W czasie wolnym:`,
					//(note: statuses are free/optional/available for different icons)
					list: [
						{status: `free`, activity: `Spacer, kąpiele w\u00A0jeziorze/leśne`},
						{status: `free`, activity: `Chodzenie bosko, spanie w\u00A0hamakach`},
						{status: `free`, activity: `Malowanie w\u00A0plenerze`},
						{status: `free`, activity: `SUP`},
						{status: `free`, activity: `Ruska bania/spa rytuał samoobsługowy`},
					],
				},
			},
			note: `Do zobaczenia!`,
			btnsContent: [
				{
					action: 'classic',
					text: `WhatsApp`,
					title: `Wiadomość WhatsApp`,
					link: whatsAppTemplate(),
					icon: 'fa-brands fa-whatsapp',
				},
				{
					action: 'classic',
					title: `Formularz Google w osobnej zakładce`,

					text: `Wypełnij formularz`,
					symbol: `edit`,
					link: `https://forms.gle/KL6LU2pXRGn4SmXw6`,
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
		id: `CA03`,
		name: `Kobieca Harmonia`,
		type: `camp`,
		date: `2025-03-07`,
		link: `camp-harmonia`,
		fileName: `camp_harmonia`,
		imgPath: `${htmlToImgsPath}/offer/camps/camp_harmonia/front`,
		galleryPath: `${htmlToImgsPath}/offer/camps/camp_harmonia/gallery`,
		gallerySize: 7,
		eventType: ``,
		extraClass: ``,
		front: {
			title: `Kobieca Harmonia
					Joga | Astrologia
					| Ecstatic Dance`,
			dates: [`07-09.03.2025`],
			location: `Mazury`,
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
				area: `Wysoka Wieś`,
				accommodation: `Stara Szkoła`,
				// capacity: `12`,
				price: `1269zł`,
				// travel: `we własnym zakresie`,
			},

			plan: {
				title: `Slow menu`,
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
						'10:00': 'Niespieszne śniadanie',
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
						'09:45': 'Niespieszne śniadanie',
						'11:00': `spacer leśny w ciszy`,
						'12:00': 'Sesja Mindfulness',
						'13:30': `Lunch i\u00A0pożegnanie`,
						'*': 'Godziny mogą ulec zmianie',
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
					title: `W czasie wolnym:`,
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
					title: `Wiadomość WhatsApp`,
					link: whatsAppTemplate(),
					icon: 'fa-brands fa-whatsapp',
				},
				{
					action: 'classic',
					title: `Formularz Google w osobnej zakładce`,

					text: `Wypełnij formularz`,
					symbol: `edit`,
					link: `https://forms.gle/fX2Dx8KJaBhQFEGh9`,
				},
			],
			formLink: `https://forms.gle/KL6LU2pXRGn4SmXw6`,
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
		link: `camp-kaszuby`,
		fileName: `camp_kaszuby`,
		imgPath: `${htmlToImgsPath}/offer/camps/camp_kaszuby/front`,
		galleryPath: `${htmlToImgsPath}/offer/camps/camp_kaszuby/gallery`,
		gallerySize: 13,
		pastGalleryPath: `${htmlToImgsPath}/offer/camps/camp_kaszuby/past_gallery`,
		pastGallerySize: 22,
		eventType: ``,
		extraClass: ``,
		front: {
			title: `Kojenie Zmysłów
	       Joga | Aromaterapia
		   | SPA | SkinCare`,
			dates: [`11-13/10/2024`],
			location: `Kaszuby`,
			desc: `...`,
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
						'13:00': `Lunch i\u00A0pożegnanie`,
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
					title: `Poszerz slow menu:`,
					list: [
						`Masaż Kobido 200zł/1h`,
						`Masaż Misami Tybetańskimi koszt na miejscu 150 zł`,
					],
				},
				freeTime: {
					title: `W czasie wolnym:`,
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
					symbol: `edit`,
					link: `https://forms.gle/kYN6VpfP3aV1b9yB8`,
				},
				{
					action: 'classic',
					text: `WhatsApp`,
					title: `Wiadomość WhatsApp`,
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
		name: `Comfy slow`,
		type: `camp`,
		date: `2024-11-08`,
		link: `camp-warmia`,
		fileName: `camp_warmia`,
		imgPath: `${htmlToImgsPath}/offer/camps/camp_warmia/front`,
		galleryPath: `${htmlToImgsPath}/offer/camps/camp_warmia/gallery`,
		gallerySize: 13,
		pastGalleryPath: `${htmlToImgsPath}/offer/camps/camp_kaszuby/past_gallery`,
		pastGallerySize: 22,
		eventType: ``,
		extraClass: `long`,
		front: {
			title: `Comfy slow weekend
	       Joga | Malowanie | SPA
		   | Misy\u00A0i\u00A0gongi`,
			dates: [`08-11.11.2024`],
			location: `Warmia`,
			desc: `...`,
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
						'13:00': `Lunch i\u00A0pożegnanie`,
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
					title: `Poszerz slow menu:`,
					list: [
						`Masaż Kobido 30zł/30min`,
						`Masaż Misami Tybetańskimi 120 zł/45min`,
						`Sauna (jeszcze w budowie)`,
					],
				},
				freeTime: {
					title: `W czasie wolnym:`,
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
					title: `Wiadomość WhatsApp`,
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
