const imgGroupPath = `/imgs/offer/regular/individual_and_group/front`;
const imgOnlinePath = `/imgs/offer/regular/online/front`;
const imgPassesPath = `/imgs/offer/prices`;
// const imgB2BPath = `/imgs/offer/regular/commercial/front`;

export const CLASSES_DATA = [
  {
    id: `CL01`,
    name: `Grupowe i\u00A0Indywidualne`,
    type: `class`,
    date: false,
    fileName: `group`,
    imgPath: `${imgGroupPath}`,
    galleryPath: ``,
    gallerySize: ``,
    eventType: ``,
    extraClass: ``,
    front: {
      title: `Stacjonarne Gdańsk`,
      dates: [],
      location: ``,
      desc: 'Sprawdź, gdzie możesz ze\u00A0mną poćwiczyć',
      btnsContent: [
        {
          action: 'classic',
          icon: 'fa-brands fa-whatsapp',
          text: `WhatsApp`,
          link: whatsAppTemplate(),
          title: `Wiadomość WhatsApp`,
        },
      ],
    },
    modal: false,
  },
  {
    id: `CL03`,
    name: `Online`,
    type: `class`,
    date: false,
    fileName: `online`,
    imgPath: `${imgOnlinePath}`,
    galleryPath: ``,
    gallerySize: ``,
    eventType: ``,
    extraClass: ``,
    front: {
      title: `Online`,
      dates: [],
      location: ``,
      desc: 'Ćwiczysz ze\u00A0mną z\u00A0dowolnego miejsca:\n\n ZOOM |\u00A0GOOGLE\u00A0MEET',
      btnsContent: [
        {
          action: 'classic',
          // symbol: 'exit_to_app',
          symbol: 'calendar_month',
          text: `Grafik`,
          link: 'https://app.fitssey.com/yoganka/frontoffice',
        },
      ],
    },
    modal: false,
  },
  // {
  //   id: `CL01`,
  //   name: `Grupowe i\u00A0Indywidualne`,
  //   type: `class`,
  //   date: false,
  //   fileName: `group`,
  //   imgPath: `${imgGroupPath}`,
  //   galleryPath: ``,
  //   gallerySize: ``,
  //   eventType: ``,
  //   extraClass: ``,
  //   // explicitLink: `/zajecia/online`,
  //   explicitLink: ``,
  //   front: {
  //     title: `Grupowe | Indywidualne`,
  //     dates: [''],
  //     location: `Online oraz Stacjonarne`,
  //     desc: `Więcej...`,
  //     btnsContent: [
  //       {
  //         action: 'classic',
  //         icon: 'fa-brands fa-whatsapp',
  //         text: `WhatsApp`,
  //         link: whatsAppTemplate(),
  //         title: `Wiadomość WhatsApp`,
  //       },
  //     ],
  //   },
  //   modal: false,
  // },
];
export const BENEFITS_TILES = [
  {
    symbol: 'wifi',
    title: 'Wygoda',
    text: 'Łączysz się z\u00A0dowolnego miejsca',
  },
  {
    symbol: 'volunteer_activism',
    title: 'Opieka',
    text: 'Korekty słowne, które\u00A0dadzą Ci lepsze zrozumienie własnego ciała',
  },
  {
    symbol: 'event_repeat ',
    // symbol: 'play_circle ',
    // symbol: 'schedule ',
    title: 'Elastyczność',
    text: 'Możliwość odtworzenia w\u00A0późniejszym czasie',
  },
  {
    symbol: 'savings',
    // symbol: 'home',
    title: 'Oszczędność',
    text: 'Czasu - nie musisz nigdzie dojeżdżać',
  },
  {
    symbol: 'self_improvement	',
    title: 'Większa uważność',
    text: 'Przez brak kontaktu fizycznego bardziej przywiązujesz uwagę do\u00A0ruchu który\u00A0masz wykonać',
  },
  {
    symbol: 'center_focus_strong',
    title: 'Skupienie',
    text: 'Na sobie -\u00A0unikasz porównywania się z\u00A0innymi uczestnikami',
  },
];
export const PRICE_LIST = [
  {
    id: `PL01`,
    name: `4 zajęcia online`,
    type: `class`,
    date: false,
    fileName: `karnet-na-zajecia-online-4-wejscia`,
    imgPath: `${imgPassesPath}/4_wejscia/front`,
    galleryPath: ``,
    gallerySize: ``,
    eventType: ``,
    extraClass: ``,
    explicitLink: `/grafik/karnety/2`,
    front: {
      title: ``,
      dates: ['155zł'],
      location: ` `,
      desc: `Sprawdź szczegóły`,
      btnsContent: [
        // {
        //   action: 'classic',
        //   icon: 'fa-brands fa-whatsapp',
        //   text: `WhatsApp`,
        //   link: whatsAppTemplate(),
        //   title: `Wiadomość WhatsApp`,
        // },
      ],
    },
    modal: false,
  },
  {
    id: `PL02`,
    name: `Wejście pojedyncze`,
    type: `class`,
    date: false,
    fileName: `pojedyncze-wejscie-na-zajecia-online`,
    imgPath: `${imgPassesPath}/pojedyncze/front`,
    galleryPath: ``,
    gallerySize: ``,
    eventType: ``,
    extraClass: ``,
    explicitLink: `/grafik/karnety`,
    front: {
      title: ``,
      dates: ['45zł'],
      location: ` `,
      desc: `Szczegóły według grafiku`,
      btnsContent: [
        // {
        //   action: 'classic',
        //   icon: 'fa-brands fa-whatsapp',
        //   text: `WhatsApp`,
        //   link: whatsAppTemplate(),
        //   title: `Wiadomość WhatsApp`,
        // },
      ],
    },
    modal: false,
  },
];
export const BTNS = {
  btnsContent: [
    {
      action: 'subPage',
      title: `Sprawdź grafik!`,
      text: `Grafik`,
      symbol: 'calendar_month',
      link: '/grafik',
    },
  ],
};
export const OFFLINE_BTNS = {
  btnsContent: [
    {
      action: 'classic',
      title: `Sprawdź grafik Zdrofit`,
      text: `Zdrofit`,
      symbol: 'calendar_month',
      link: 'https://zdrofit.pl/kluby-fitness',
    },
    {
      action: 'classic',
      title: `Sprawdź grafik SUPer Strefy`,
      text: `SUPer Strefa`,
      symbol: 'calendar_month',
      link: 'https://superstrefa.pl/joga/',
    },
  ],
};
