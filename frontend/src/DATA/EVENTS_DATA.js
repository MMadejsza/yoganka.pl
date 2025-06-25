import { whatsAppTemplate } from '../utils/utils.jsx';
const htmlToImgsPath = `/imgs`;

export const EVENTS_DATA = [
  {
    id: `E06`,
    name: `Yoga piknik i malowanie ceramiki`,
    type: `event`,
    date: `2025-07-21`,
    link: `yoga-piknik-i-malowanie-ceramiki`,
    fileName: `yoga_piknik_i_malowanie_ceramiki`,
    imgPath: `${htmlToImgsPath}/offer/events/yoga_piknik/front`,
    galleryPath: `${htmlToImgsPath}/offer/events/yoga_piknik/gallery`,
    gallerySize: 0,
    order: 3,
    eventType: `fixed`,
    extraClass: `event`,
    front: {
      title: `Yoga piknik i\u00A0malowanie ceramiki`,
      dates: ['II połowa lipca'],
      location: 'Park Reagana',
      desc: `W PRZYGOTOWANIU...`,
      btnsContent: [],
    },
    modal: {
      title: `Yoga piknik i\u00A0malowanie ceramiki`,
      fullDescTitle: `O spotkaniu:`,
      fullDesc: `W przygotowaniu`,
      program: {
        listType: 'excluded',
        title: `W programie:`,
        list: [
          'Praktyka jogi',
          'Malowanie ceramiki',
          'Piknik, rozmowy, celebracja',
        ],
      },
      btnsContent: [
        {
          action: 'classic',
          text: `WhatsApp`,
          title: `Wiadomość WhatsApp`,
          link: whatsAppTemplate(),
          icon: 'fa-brands fa-whatsapp',
        },
        // {
        //   action: 'link',
        //   title: `Grafik Yoganka`,
        //   text: `Sprawdź grafik!`,
        //   symbol: 'calendar_month',
        //   navLink: `/grafik`,
        // },
      ],
      formLink: ``,
      note: `Szczegóły już wkrótce!`,
      // questionTemplate(subject) {
      // 	return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
      // },
      glance: {
        // area: `Park Reagana`,
        // price: `220zł`,
      },
      plan: {},
      included: {},
      excluded: {},
      optional: {},
      freeTime: {},
    },
  },
  {
    id: `E05`,
    name: `Yoga pod chmurką`,
    type: `event`,
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    link: `yoga-pod-chmurka`,
    fileName: `yoga_pod_chmurka`,
    imgPath: `${htmlToImgsPath}/offer/events/yoga_pod_chmurka/front`,
    galleryPath: `${htmlToImgsPath}/offer/events/yoga_pod_chmurka/gallery`,
    gallerySize: 0,
    order: 1,
    eventType: `repetitive`,
    extraClass: `event`,
    front: {
      title: `Yoga pod\u00A0chmurką`,
      dates: [`Czerwiec-Wrzesień`],
      location: 'Park lub plaża (Gdańsk)',
      desc: `To doskonała alternatywa dla wyjazdów weekendowych, kiedy nie możesz sobie na nie pozwolić...`,
      btnsContent: [],
    },
    modal: {
      title: `Yoga pod\u00A0chmurką`,
      fullDescTitle: `O spotkaniu:`,
      fullDesc: `Joga w\u00A0plenerze. 60\u00A0min praktyki w\u00A0stylu vinyasa flow. Organizowana okazjonalnie przy\u00A0dobrej pogodzie. Sprawdź grafik celem uzyskania szczegółów o\u00A0zbliżających się\u00A0zajęciach pod\u00A0chmurką (miejsce,\u00A0data). Na\u00A0każde spotkanie obowiązują zapisy oraz \u00A0przedpłata. Sprawdź regulamin.`,

      program: {
        listType: 'excluded',
        title: `W programie:`,
        list: [],
      },
      btnsContent: [
        {
          action: 'classic',
          text: `WhatsApp`,
          title: `Wiadomość WhatsApp`,
          link: whatsAppTemplate(),
          icon: 'fa-brands fa-whatsapp',
        },
        {
          action: 'link',
          title: `Grafik Yoganka`,
          text: `Sprawdź grafik!`,
          symbol: 'calendar_month',
          navLink: `/grafik`,
        },
      ],
      formLink: ``,
      note: `Rezerwacje w grafiku`,
      // questionTemplate(subject) {
      // 	return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
      // },
      glance: {
        area: `Park lub plaża (Gdańsk)`,
        price: `30zł`,
      },
      plan: {},
      included: {},
      excluded: {},
      optional: {},
      freeTime: {},
    },
  },
  {
    id: `E01`,
    name: `Śniadanie z Yogą`,
    type: `event`,
    date: `2025-02-23`,
    link: `sniadanie-z-yoga`,
    fileName: `sniadanie_z_yoga`,
    imgPath: `${htmlToImgsPath}/offer/events/sniadanie_z_yoga/front`,
    galleryPath: `${htmlToImgsPath}/offer/events/sniadanie_z_yoga/front`,
    gallerySize: 0,
    eventType: `repetitive`,
    extraClass: `event`,
    front: {
      title: `Śniadanie z\u00A0Yogą`,
      dates: [`23/02/2025 godz. 8:00`],
      location: 'Restauracja VANA, Garnizon',
      desc: `Rozpocznij swój dzień od harmonijnego połączenia ruchu i smaku! Podczas naszego ...`,
      btnsContent: [],
    },
    modal: {
      title: `Śniadanie z\u00A0Yogą`,
      fullDescTitle: `O spotkaniu:`,
      fullDesc: `
			Rozpocznij swój dzień od\u00A0harmonijnego połączenia ruchu i\u00A0smaku! Podczas naszego wydarzenia Śniadanie z\u00A0jogą czeka\u00A0Cię poranna sesja jogi, która\u00A0rozbudzi Twoje ciało, wyciszy umysł i\u00A0napełni energią (slow\u00A0flow\u00A0joga). Po praktyce zapraszamy na\u00A0zdrowe, pyszne śniadanie w\u00A0przyjaznej atmosferze – idealne, by\u00A0zjeść wspólnie, porozmawiać i\u00A0cieszyć\u00A0się dobrym początkiem dnia.

			To idealnie połączenie przyjemnego z\u00A0pożytecznym. Przy\u00A0okazji wyjścia do\u00A0miasta, robisz dla siebie coś dobrego - zwalniasz po\u00A0oddech, równowagę i\u00A0regenerację. 
			Joga potrwa 60\u00A0minut.
			
			Dołącz\u00A0do\u00A0nas!
			`,

      program: {
        listType: 'excluded',
        title: `Menu śniadaniowe:`,
        list: [
          `Choco-Orange Oatmeal, kremowa czekoladowo-pomarańczowa owsianka z\u00A0jogurtem i\u00A0świeżą pomarańczą`,
          `Cinnamon\u00A0Roll\u00A0Omlette, puszysty omlet cynamonka, otulony karmelizowanymi jabłkami`,
          `Asparagus Turkish Eggs, jajka po\u00A0turecku ze\u00A0szparagami i\u00A0koperkiem. Podane z\u00A0chlebem na\u00A0zakwasie`,
          `Eggsperience, 3\u00A0jajka na\u00A0maśle ze\u00A0szczypiorkiem (jajecznica lub sadzone), podane z\u00A0sałatką i\u00A0z\u00A0chlebem na\u00A0zakwasie`,
          `Beets, bajgiel z\u00A0hummusem buraczanym, carpaccio z\u00A0buraka i\u00A0kozim serem`,
          `Jedna kawa/herbata`,
        ],
      },
      btnsContent: [
        {
          action: 'classic',
          text: `WhatsApp`,
          title: `Wiadomość WhatsApp`,
          link: whatsAppTemplate(),
          icon: 'fa-brands fa-whatsapp',
        },
        {
          action: 'link',
          title: `Grafik Yoganka`,
          text: `Sprawdź grafik!`,
          symbol: 'calendar_month',
          navLink: `/grafik`,
        },
      ],
      formLink: `mailto:kontakt@yoganka.pl?&body=Hej! Piszę do Ciebie z yoganka.pl`,
      note: `Wymiana: 79zł`,
      // questionTemplate(subject) {
      // 	return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
      // },
      glance: {},
      plan: {},
      included: {},
      excluded: {},
      optional: {},
      freeTime: {},
    },
  },
  {
    id: `E03`,
    name: `YOGA & SOUND - Moon Ceremony`,
    type: `event`,
    date: `2025-05-21`,
    link: `yoga&sound`,
    fileName: `yoga&sound`,
    imgPath: `${htmlToImgsPath}/offer/events/yoga&sound/front`,
    galleryPath: `${htmlToImgsPath}/offer/events/yoga&sound/front`,
    gallerySize: 0,
    eventType: `repetitive`,
    extraClass: `event`,
    front: {
      title: `Yoga\u00A0&\u00A0Sound
		Moon\u00A0Ceremony`,
      dates: [`Latem`],
      location: `Plaże w Gdańsku`,
      desc: `Joga na\u00A0plaży przy pełni księżyca z\u00A0dźwiękami mis i\u00A0gongów w\u00A0tle, które wprowadzą Cię w\u00A0relaksującą podróż`,
      btnsContent: [],
    },
    modal: {
      title: `Yoga\u00A0&\u00A0Sound
		Moon\u00A0Ceremony`,
      fullDescTitle: `O spotkaniu:`,
      fullDesc: `Takiego wydarzenia w\u00A0Trójmieście nie\u00A0było. Dźwięki mis\u00A0i\u00A0gongów tworzą kojącą atmosferę, pomagając w\u00A0głębszym relaksie i medytacji. Pod rozgwieżdżonym niebem, wśród szumu fal, każda asana staje się bardziej intymna i\u00A0energetyzująca. Bliskość natury i\u00A0moc pełni księżyca dodają praktyce niezwykłej mocy uzdrawiającej. To idealna okazja, by odprężyć ciało, wyciszyć umysł i\u00A0połączyć się z\u00A0otaczającą cię przyrodą.`,
      program: {
        title: `Relaks menu:`,
        listType: 'included',
        list: [
          `Joga przy dźwiękach mis\u00A0i\u00A0gongów (gra\u00A0Agnieszka\u00A0Topp)`,
          `Relaks z\u00A0opaską na\u00A0oczach nasączoną aromatycznymi olejkami`,
          `Zdrowy napar naszego przepisu`,
          `Inspirujące rozmowy w\u00A0kręgu`,
          `Upominek`,
        ],
      },
      btnsContent: [
        {
          action: 'classic',
          text: `WhatsApp`,
          title: `Wiadomość WhatsApp`,
          link: whatsAppTemplate(),
          icon: 'fa-brands fa-whatsapp',
        },
      ],
      formLink: `https://forms.gle/kYN6VpfP3aV1b9yB8`,
      note: ``,
      glance: {},
      plan: {},
      included: {},
      excluded: {},
      optional: {},
      freeTime: {},
    },
  },
  {
    id: `E04`,
    name: `Sup Yoga`,
    type: `event`,
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    fileName: `sup`,
    link: `sup-yoga`,
    imgPath: `${htmlToImgsPath}/offer/events/sup/front`,
    galleryPath: `${htmlToImgsPath}/offer/events/sup/front`,
    gallerySize: 0,
    order: 1,
    eventType: `repetitive`,
    extraClass: `event`,
    front: {
      title: `Sup Yoga`,
      dates: [`Lipiec-Sierpień`],
      location: `Gdańsk, SUPer\u00A0Strefa
      wejście nr 54`,
      desc: `Praktyka jogi na\u00A0wodzie, czyli prawdziwe zen\u00A0nature`,
      btnsContent: [],
    },
    modal: {
      title: `Sup Yoga`,
      fullDescTitle: `O zajęciach:`,
      fullDesc: `Zapraszam do\u00A0wodnego studia jogi. Zamieniamy matę na\u00A0deskę SUP. Poprawisz balans, wzmocnisz mięśnie posturalne. Otwarta przestrzeń z\u00A0nieskończonym oknem na\u00A0naturę stanowi doskonałą propozycję na\u00A0ciepłe dni. Czy jest coś wspanialszego od\u00A0jogi na\u00A0powietrzu? Promienie słońca, letni podmuch wiatru i\u00A0szum drzew dopełnią Twoją praktykę.`,
      program: {
        title: ``,
        listType: 'included',
        list: [],
      },
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
          title: `Formularz Feetsy w osobnej zakładce`,
          text: `Zapisz się w Feetsy`,
          symbol: 'edit',
          link: `https://app.fitssey.com/SUPerstrefa/frontoffice`,
        },
      ],
    },
    formLink: ``,
    note: ``,
    // questionTemplate(subject) {
    // 	return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
    // },
    glance: {},
    plan: {},
    included: {},
    excluded: {},
    optional: {},
    freeTime: {},
  },
  // #region
  // {
  // 	id: `E01`,
  // 	name: `Yoga\u00A0&\u00A0Breakfast`,
  // 	type: `event`,
  // 	date: `2025-01-12`,
  // 	link: `yoga-breakfast`,
  // 	fileName: `yoga_breakfast`,
  // 	imgPath: `${htmlToImgsPath}/offer/events/yoga_breakfast/front`,
  // 	galleryPath: `${htmlToImgsPath}/offer/events/yoga_breakfast/front`,
  // 	gallerySize: 0,
  // 	eventType: `fixed`,
  // 	extraClass: `event`,
  // 	front: {
  // 		title: `Yoga\u00A0&\u00A0Breakfast`,
  // 		dates: [`11/01/2025 godz. 9:30`, `12/01/2025 godz. 9:30`],
  // 		location: `toMy Kawiarnia\u00A0Gdańsk`,
  // 		desc: `Błogi poranek z jogą w uroczej przestrzeni toMy kawiarnia w Gdańsku...`,
  // 		btnsContent: [],
  // 	},
  // 	modal: {
  // 		fullDescTitle: `O spotkaniu:`,
  // 		fullDesc: `Błogi poranek z\u00A0ogą w\u00A0uroczej przestrzeni toMy kawiarnia\u00A0w\u00A0Gdańsku. Po praktyce usiądziemy razem do\u00A0stołu i\u00A0zjemy pyszne śniadanie przygotowane przez pracowników kawiarni. Zabierz swoją matę. Możesz dołączyć też tylko na\u00A0samą praktykę.

  // 		Do zobaczenia!`,

  // 		program: {
  // 			title: `Relaks menu:`,
  // 			list: [`Praktyka jogi (50min)`, `Zdrowy napar`, `Śniadanie wegetariańskie`],
  // 		},
  // 		btnsContent: [
  // 			{
  // 				action: 'classic',
  // 				text: `WhatsApp`,
  // 				title: `Wiadomość WhatsApp`,
  // 				link: whatsAppTemplate(),
  // 				icon: 'fa-brands fa-whatsapp',
  // 			},
  // 			{
  // 				action: 'classic',
  // 				title: `Formularz Google w osobnej zakładce`,
  // 				text: `Wyślij maila`,
  // 				symbol: 'mail',
  // 				link: `mailto:kontakt@yoganka.pl?&body=Hej! Piszę do Ciebie z yoganka.pl`,
  // 			},
  // 		],
  // 		formLink: `mailto:kontakt@yoganka.pl?&body=Hej! Piszę do Ciebie z yoganka.pl`,
  // 		note: `Wymiana: 40 zł bez śniadania
  // 		80zł ze śniadaniem
  // 		(w obu wariantach napar już w cenie)`,
  // 		// questionTemplate(subject) {
  // 		// 	return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
  // 		// },
  // 		glance: {},
  // 		plan: {},
  // 		included: {},
  // 		excluded: {},
  // 		optional: {},
  // 		freeTime: {},
  // 	},
  // },
  // {
  // 	id: `E02`,
  // 	name: `Wieczorna joga w\u00A0jurcie`,
  // 	type: `event`,
  // 	date: `2025-03-16`,
  // 	link: `wieczorna-joga-w-jurcie`,
  // 	fileName: `jurta`,
  // 	imgPath: `${htmlToImgsPath}/offer/events/jurta/front`,
  // 	galleryPath: `${htmlToImgsPath}/offer/events/jurta/front`,
  // 	gallerySize: 0,
  // 	eventType: `repetitive`,
  // 	extraClass: `event`,
  // 	front: {
  // 		title: `Wieczorna joga w\u00A0jurcie`,
  // 		dates: [`Środy godz. 19:30`, ' ', ' '],
  // 		location: `Jurta ul.\u00A0Makowa\u00A08, Tuchom`,
  // 		desc: `Zapraszam Cię na wyjątkową praktykę jogi w przytulnej jurcie`,
  // 		btnsContent: [],
  // 	},
  // 	modal: {
  // 		fullDescTitle: `O praktyce:`,
  // 		fullDesc: `Zapraszam Cię na\u00A0wyjątkową praktykę jogi w\u00A0przytulnej jurcie. Jej kształt, drewniane wnętrze, ogień kominka sprzyjają odprężającej praktyce. Spotykamy się w\u00A0kameralnym gronie w\u00A0każdą środę o\u00A019.30.`,
  // 		program: {
  // 			title: `Relaks menu:`,
  // 			list: [
  // 				`Medytacja`,
  // 				`Ćwiczenia oddechowe`,
  // 				`Joga hatha oraz Yin`,
  // 				`Dłuższa relaksacja`,
  // 			],
  // 		},
  // 		btnsContent: [
  // 			{
  // 				action: 'classic',
  // 				text: `WhatsApp`,
  // title: `Wiadomość WhatsApp`,
  // 				link: whatsAppTemplate(),
  // 				icon: 'fa-brands fa-whatsapp',
  // 			},
  // 			{
  // 				action: 'classic',
  // 				text: `Zgłoś się mailowo`,
  // 				title: `Wyślij maila`,

  // 				link: `mailto:kontakt@yoganka.pl?&body=Hej! Piszę do Ciebie z yoganka.pl`,
  // 			},
  // 		],
  // 		formLink: `mailto:kontakt@yoganka.pl?&body=Hej! Piszę do Ciebie z yoganka.pl`,
  // 		note: `Cena: 50zł`,
  // 		// questionTemplate(subject) {
  // 		// 	return `Hej! Piszę do Ciebie z yoganka.pl :), Mam pytanie odnośnie "${subject}"\n\nTu [imię] [Nazwisko]`;
  // 		// },
  // 		glance: {},
  // 		plan: {},
  // 		included: {},
  // 		excluded: {},
  // 		optional: {},
  // 		freeTime: {},
  // 	},
  // },
  // #endregion
].sort((x, y) => {
  const now = new Date();
  const xDate = new Date(x.date);
  const yDate = new Date(y.date);

  const xIsPast = xDate < now;
  const yIsPast = yDate < now;

  // 1. Past events go below future ones
  if (xIsPast && !yIsPast) return 1;
  if (!xIsPast && yIsPast) return -1;

  // 2. Within each group: sort by manual order (lower number = higher priority)
  const xOrder = x.order ?? 9999; // fallback for undefined
  const yOrder = y.order ?? 9999;

  if (xOrder !== yOrder) return xOrder - yOrder;

  // 3. Within same order: fixed events come before repetitive ones
  if (x.eventType === 'fixed' && y.eventType !== 'fixed') return -1;
  if (x.eventType !== 'fixed' && y.eventType === 'fixed') return 1;

  // 4. As final fallback: sort by date (ascending)
  return xDate - yDate;
});
