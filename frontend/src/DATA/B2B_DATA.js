const htmlToImgsPath = `/imgs`;

export const OFFER = [
	// Add comments for each property
	{
		id: `B01`,
		name: `Joga`,
		type: `b2b`,
		date: `2095-01-01`,
		link: ``,
		fileName: `joga`,
		imgPath: `${htmlToImgsPath}/b2b/offer/joga/front`,
		galleryPath: ``,
		gallerySize: '',
		eventType: ``,
		extraClass: ``,
		front: {
			title: `JOGA`,
			dates: [``],
			location: ``,
			desc: `...`,
			btnsContent: [],
		},
		back: `Łagodna praktyka ruchu, która\u00A0odciąża kręgosłup, redukuje napięcia wynikające z\u00A0siedzącego trybu pracy i\u00A0wzmacnia mięśnie. Dzięki niej pracownicy czują się\u00A0bardziej zrelaksowani, zdrowi i\u00A0pełni energii na\u00A0co\u00A0dzień`,
	},
	{
		id: `B02`,
		name: `MINDFULNESS`,
		type: `b2b`,
		date: `2095-01-01`,
		link: ``,
		fileName: `mindfulness`,
		imgPath: `${htmlToImgsPath}/b2b/offer/mindfulness/front`,
		galleryPath: ``,
		gallerySize: '',
		eventType: ``,
		extraClass: ``,
		front: {
			title: `MINDFULNESS`,
			dates: [``],
			location: ``,
			desc: `...`,
			btnsContent: [],
		},
		back: `Trening uważności, który\u00A0uczy, jak świadomie zarządzać stresem i\u00A0emocjami. Pomaga pracownikom działać efektywniej, poprawia koncentrację i\u00A0wspiera odporność psychiczną`,
	},
	{
		id: `B03`,
		name: `Relaksacyjna`,
		type: `b2b`,
		date: `2095-01-01`,
		link: ``,
		fileName: `relaksacyjna`,
		imgPath: `${htmlToImgsPath}/b2b/offer/relaksacyjna/front`,
		galleryPath: ``,
		gallerySize: '',
		eventType: ``,
		extraClass: ``,
		front: {
			title: `TECHNIKI RELAKSACYJNE`,
			dates: [],
			location: ``,
			desc: `...`,
			btnsContent: [],
		},
		back: `Proste metody oddechowe i\u00A0wizualizacyjne, które\u00A0redukują napięcie i\u00A0wspierają regenerację. Pracownicy szybciej się\u00A0odprężają i\u00A0lepiej radzą sobie w\u00A0trudnych sytuacjach.`,
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

export const TYPES = [
	{
		symbol: 'home_work',
		title: 'Regularne zajęcia w\u00A0biurze/online',
		text: 'Proponuję elastyczne rozwiązania –\u00A0czas trwania dopasuję do\u00A0potrzeb pracowników 20-60\u00A0minut',
	},
	{
		symbol: 'workspace_premium',
		title: 'Jednorazowe sesje na\u00A0specjalne okazje',
		text: 'Np. eventy\u00A0firmowe (joga jako część dnia promującego zdrowy styl życia), czy\u00A0integracja zespołu',
	},
	{
		symbol: 'diversity_2',
		title: 'Warsztat tematyczny',
		text: 'Warsztaty to\u00A0coś więcej niż\u00A0jednorazowe doświadczenie -\u00A0to\u00A0czas, w którym pracownicy zdobywają wiedzę i\u00A0praktyczne umiejętności, które\u00A0mogą wykorzystać na\u00A0co\u00A0dzień. Każdy warsztat trwa od\u00A060 do\u00A0120 minut i\u00A0jest dostosowany do\u00A0konkretnej grupy lub\u00A0celu biznesowego',
	},
	{
		symbol: 'spa',
		title: 'Programy Wellbeingowe',
		text: 'Tygodniowe/miesięczne spersonalizowane programy wellbeingowe, które\u00A0mogą obejmować jogę, mindfulness i\u00A0techniki relaksacyjne',
	},
];
