import { whatsAppTemplate } from '../utils/utils.jsx';
const imgGroupPath = `/imgs/offer/regular/individual_and_group/front`;
const imgOnlinePath = `/imgs/offer/regular/online/front`;
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
      desc: ``,
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
      desc: ``,
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
  // {
  // 	id: `CL02`,
  // 	name: `Joga dla\u00A0firm`,
  // 	type: `class`,
  // 	date: false,
  // 	fileName: `commercial`,
  // 	imgPath: `${imgB2BPath}`,
  // 	galleryPath: ``,
  // 	gallerySize: ``,
  // 	eventType: ``,
  // 	extraClass: ``,
  // 	front: {
  // 		title: `Joga dla\u00A0firm`,
  // 		dates: [],
  // 		location: ``,
  // 		desc: ``,
  // 		btnsContent: [
  // 			{
  // 				action: 'classic',
  // 				symbol: 'mail',
  // 				text: `Wyślij maila`,
  // 				link: `mailto:kontakt@yoganka.pl`,
  // 				title: `kontakt@yoganka.pl`,
  // 			},
  // 			// {
  // 			// 	type: 'router',
  // 			// 	text: `Współpraca B2B`,
  // 			// 	link: `/b2b`,
  // 			// },
  // 		],
  // 	},
  // 	modal: false,
  // },
];
